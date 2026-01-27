const axios = require('axios');

const API_URL = 'https://apis.mypropertyfact.in/projects/search-by-type-city-budget';
const IMAGE_BASE_URL = 'https://apis.mypropertyfact.in/get/images/properties/';

const PROPERTY_TYPE_MAP = {
    'residential': 1,
    'commercial': 2,
    'new launch': 1,
    'new launches': 1
};

const CITY_MAP = {
    'agra': 1, 'noida': 2, 'ludhiana': 6, 'mumbai': 14, 'ghaziabad': 15,
    'gurugram': 17, 'bangalore': 18, 'jaipur': 19, 'kochi': 20, 'hyderabad': 21,
    'greater noida': 26, 'noida extension': 27, 'lucknow': 31, 'chandigarh': 33,
    'goa': 41, 'delhi': 2, 'pune': 14, 'faridabad': 35
};

const CITY_ALIASES = {
    'gurgaon': 'gurugram',
    'gururam': 'gurugram',
    'benglore': 'bangalore',
    'banglore': 'bangalore',
    'bengaluru': 'bangalore',
    'bengluru': 'bangalore',
    'new delhi': 'delhi',
    'gr noida': 'greater noida',
    'gzb': 'ghaziabad'
};

const ALLOWED_CITIES = Object.keys(CITY_MAP);

const STATES = {
    WELCOME: 'WELCOME',
    TYPE_SELECTED: 'TYPE',
    CITY_SELECTED: 'CITY',
    RESULTS: 'RESULTS'
};

// Simple in-memory session store
const sessions = {};

async function generateAIResponse(message, sessionId) {
    const msg = message.trim().toLowerCase();

    if (!sessions[sessionId]) {
        sessions[sessionId] = { step: STATES.WELCOME, data: {} };
    }
    const session = sessions[sessionId];

    if (msg === 'restart' || msg === 'reset' || msg === 'hi' || msg === 'hello') {
        session.step = STATES.WELCOME;
        session.data = {};
        session.flags = null;
        return {
            reply: `Hi 👋\nWelcome to My Property Fact!\n\nReady to find the perfect property? 🏡✨\n\nPlease select your property type to get started.`,
            options: ['Commercial', 'Residential', 'New Launch']
        };
    }

    if ((msg === 'yes, explore more' || msg === 'yes') && !session?.flags?.waitingForConfirmation && session.step !== STATES.RESULTS) {
        session.step = STATES.WELCOME;
        return {
            reply: `Great! Let's find more properties.\n\nPlease select your property type to get started.`,
            options: ['Commercial', 'Residential', 'New Launch']
        };
    }
    if ((msg === 'no, thank you' || msg === 'no') && !session?.flags?.waitingForConfirmation && session.step !== STATES.RESULTS) {
        return {
            reply: `It was a pleasure helping you! Have a great day. 👋`,
            options: ['Restart']
        };
    }

    switch (session.step) {
        case STATES.WELCOME:
            if (msg.includes('commercial') || msg.includes('residential') || msg.includes('new launch')) {
                let typeKey = 'residential';
                if (msg.includes('commercial')) typeKey = 'commercial';
                if (msg.includes('residential')) typeKey = 'residential';
                if (msg.includes('new launch')) typeKey = 'new launch';

                session.data.type = typeKey;
                session.step = STATES.TYPE_SELECTED;

                return {
                    reply: `Which city are you interested in?`,
                    options: ['Noida', 'Gurugram', 'Ghaziabad', 'Greater Noida', 'Faridabad', 'Delhi', 'Other']
                };
            } else {
                return {
                    reply: `Hi 👋\nWelcome to My Property Fact!\n\nReady to find the perfect property? 🏡✨\n\nPlease select your property type to get started.`,
                    options: ['Commercial', 'Residential', 'New Launch']
                };
            }

        case STATES.TYPE_SELECTED:
            let inputCity = msg.trim().toLowerCase();
            if (CITY_ALIASES[inputCity]) {
                inputCity = CITY_ALIASES[inputCity];
            }

            if (inputCity === 'other') {
                session.flags = { waitingForCity: true };
                return {
                    reply: `Please enter your preferred city:`,
                    options: []
                };
            }

            const getLevenshteinDistance = (a, b) => {
                if (a.length === 0) return b.length;
                if (b.length === 0) return a.length;
                const matrix = [];
                for (let i = 0; i <= b.length; i++) matrix[i] = [i];
                for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
                for (let i = 1; i <= b.length; i++) {
                    for (let j = 1; j <= a.length; j++) {
                        if (b.charAt(i - 1) == a.charAt(j - 1)) {
                            matrix[i][j] = matrix[i - 1][j - 1];
                        } else {
                            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
                        }
                    }
                }
                return matrix[b.length][a.length];
            };

            if (msg === 'buy property') {
                session.flags = null;
                session.step = STATES.WELCOME;
                return {
                    reply: `Please select your property type to get started.`,
                    options: ['Commercial', 'Residential', 'New Launch']
                };
            }

            if (session.flags && session.flags.waitingForConfirmation) {
                if (msg === 'yes' || msg === 'yes, correct') {
                    session.data.city = session.flags.suggestedCity;
                    session.step = STATES.CITY_SELECTED;
                    session.flags = null;
                    return {
                        reply: `What is your budget range?`,
                        options: ['Up to ₹1 Cr', '₹1 Cr – ₹3 Cr', '₹3 Cr – ₹5 Cr', 'Above ₹5 Cr']
                    };
                } else {
                    session.flags = null;
                    return {
                        reply: `Currently, we don’t have any projects in this location.\n\nWould you like to see projects in another city? \n\nPlease select a city:`,
                        options: ['Noida', 'Gurugram', 'Ghaziabad', 'Greater Noida', 'Faridabad', 'Delhi', 'Other']
                    };
                }
            }

            if (session.flags && session.flags.waitingForCity) {
                const matched = ALLOWED_CITIES.find(c => inputCity.includes(c));
                let fuzzyMatch = null;
                if (!matched) {
                    for (const city of ALLOWED_CITIES) {
                        const dist = getLevenshteinDistance(inputCity, city);
                        const threshold = city.length > 5 ? 3 : 2;
                        if (dist <= threshold) {
                            fuzzyMatch = city;
                            break;
                        }
                    }
                }

                const isQuestion = /^(who|what|where|when|why|how|can|do|does|is|are)\b/.test(inputCity);
                const hasKeywords = /(joke|weather|movie|song|story|poem|president|minister|color|hair|time|date|news|cricket|score)/.test(inputCity);
                const longSentence = inputCity.split(/\s+/).length > 3;
                const isOutOfScope = isQuestion || hasKeywords || longSentence;

                if (matched) {
                    session.data.city = matched;
                    session.step = STATES.CITY_SELECTED;
                    session.flags = null;
                    return {
                        reply: `What is your budget range?`,
                        options: ['Up to ₹1 Cr', '₹1 Cr – ₹3 Cr', '₹3 Cr – ₹5 Cr', 'Above ₹5 Cr']
                    };
                } else if (fuzzyMatch) {
                    session.flags.waitingForConfirmation = true;
                    session.flags.suggestedCity = fuzzyMatch;
                    session.flags.waitingForCity = false;
                    const displayCity = fuzzyMatch.charAt(0).toUpperCase() + fuzzyMatch.slice(1);
                    return {
                        reply: `Did you mean *${displayCity}*?`,
                        options: ['Yes', 'No']
                    };
                } else if (isOutOfScope) {
                    session.flags = null;
                    return {
                        reply: `That's a great question, but I am here only for property-related queries.\nWould you like to buy property?`,
                        options: ['Buy Property']
                    };
                } else {
                    session.flags = null;
                    return {
                        reply: `Currently, we don’t have any projects in this location.\n\nWould you like to see projects in another city? \n\nPlease select a city:`,
                        options: ['Noida', 'Greater Noida', 'Ghaziabad', 'Gurugram', 'Faridabad', 'Delhi', 'Other']
                    };
                }
            }

            let matchedCity = ALLOWED_CITIES.find(c => inputCity.includes(c));
            if (matchedCity) {
                session.data.city = matchedCity;
                session.step = STATES.CITY_SELECTED;
                return {
                    reply: `What is your budget range?`,
                    options: ['Up to ₹1 Cr', '₹1 Cr – ₹3 Cr', '₹3 Cr – ₹5 Cr', 'Above ₹5 Cr']
                };
            }

            const isOutOfScopeDefault = /(joke|weather|movie|song|who are you)/.test(inputCity);
            if (!isOutOfScopeDefault) {
                return {
                    reply: `Currently, we don’t have any projects in this location.\n\nWould you like to see projects in another city? \n\nPlease select a city:`,
                    options: ['Noida', 'Greater Noida', 'Ghaziabad', 'Gurugram', 'Faridabad', 'Delhi', 'Other']
                };
            }

            return {
                reply: `That's a great question, but I am here only for property-related queries.\nI can help you buy property.`,
                options: []
            };

        case STATES.CITY_SELECTED:
            const BUDGET_MAP = {
                'up to ₹1 cr': 'Up to 1Cr',
                '₹1 cr – ₹3 cr': '1Cr-3Cr',
                '₹3 cr – ₹5 cr': '3Cr-5Cr',
                'above ₹5 cr': 'Above 5Cr',
                'up to 1 cr': 'Up to 1Cr',
                'upto 1 cr': 'Up to 1Cr',
                '1 cr - 3 cr': '1Cr-3Cr',
                '1cr - 3cr': '1Cr-3Cr',
                '3 cr - 5 cr': '3Cr-5Cr',
                '3cr - 5cr': '3Cr-5Cr',
                'above 5 cr': 'Above 5Cr',
                'above 5cr': 'Above 5Cr'
            };

            const cleanMsg = msg.replace(/\s+/g, ' ').trim();
            if (!BUDGET_MAP[cleanMsg]) {
                return {
                    reply: `Please select a budget range from the options above.`,
                    options: ['Up to ₹1 Cr', '₹1 Cr – ₹3 Cr', '₹3 Cr – ₹5 Cr', 'Above ₹5 Cr']
                };
            }

            const apiBudget = BUDGET_MAP[cleanMsg];
            session.data.budget = apiBudget;
            session.step = STATES.RESULTS;

            try {
                const typeId = PROPERTY_TYPE_MAP[session.data.type] || 1;
                const cityId = CITY_MAP[session.data.city] || 2;

                const response = await axios.get(API_URL, {
                    params: {
                        propertyType: typeId,
                        propertyLocation: cityId,
                        budget: apiBudget
                    }
                });

                session.data.allProjects = response.data || [];
                session.data.currentIndex = 0;

                const getNextBatch = () => {
                    const batch = session.data.allProjects.slice(session.data.currentIndex, session.data.currentIndex + 3);
                    session.data.currentIndex += 3;
                    return batch;
                };

                const projects = getNextBatch();

                if (projects && projects.length > 0) {
                    const cards = projects.map(p => {
                        const slug = p.projectSlug || p.projectName.toLowerCase()
                            .replace(/&/g, 'and')
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '');

                        const fullImageUrl = (p.projectThumbnailImage && p.projectThumbnailImage.startsWith('http'))
                            ? p.projectThumbnailImage
                            : (p.projectThumbnailImage ? `${IMAGE_BASE_URL}${slug}/${p.projectThumbnailImage}` : 'https://via.placeholder.com/300x200?text=No+Image');

                        return {
                            id: p.id,
                            name: p.projectName,
                            location: p.projectAddress || p.cityName,
                            price: p.projectStartingPrice || 'Price on Request',
                            image: fullImageUrl,
                            builder: p.builderName,
                            status: p.projectStatusName,
                            link: `https://mypropertyfact.in/${slug}`
                        };
                    });

                    const hasMore = session.data.currentIndex < session.data.allProjects.length;
                    const options = hasMore ? ['Yes', 'No'] : ['Restart'];
                    let reply = `Here are the top 3 projects in ${session.data.city}:`;
                    let followUp = null;

                    if (session.data.currentIndex > 3) reply = `Here are more projects:`;
                    if (hasMore) followUp = `Would you like to see more projects?`;

                    return {
                        reply: reply,
                        followUp: followUp,
                        projectCards: cards,
                        options: options
                    };
                } else {
                    return {
                        reply: `Sorry, we couldn't find any projects matching your requirement.\nWould you like to change filters?`,
                        options: ['Restart']
                    };
                }
            } catch (e) {
                console.error(e);
                return {
                    reply: `Something went wrong. Please try again.`,
                    options: ['Restart']
                };
            }

        case STATES.RESULTS:
            if (['yes', 'yes, please', 'sure'].includes(msg)) {
                const typeId = PROPERTY_TYPE_MAP[session.data.type] || 1;
                const cityId = CITY_MAP[session.data.city] || 2;
                const apiBudget = session.data.budget;
                const redirectParam = `propertyType=${typeId}&propertyLocation=${cityId}&budget=${encodeURIComponent(apiBudget)}`;
                const targetUrl = `/projects?${redirectParam}`;

                return {
                    reply: `Redirecting you to view more projects on our website...`,
                    redirectUrl: targetUrl
                };
            }

            if (['no', 'no, thanks'].includes(msg)) {
                return {
                    reply: `Thank you for your time!\nHave a great day 😊`,
                    options: []
                };
            }

            return {
                reply: `To search again, please type 'Restart'.`,
                options: ['Restart']
            };

        default:
            return {
                reply: `Please type 'Restart' to start over.`,
                options: ['Restart']
            };
    }
}

module.exports = {
    generateAIResponse,
    sessions,
    PROPERTY_TYPE_MAP,
    CITY_MAP,
    STATES
};