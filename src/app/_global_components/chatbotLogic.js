const axios = require('axios');

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}projects/search-by-type-city-budget`;
const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/`;

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
    'goa': 41, 'delhi': 30, 'faridabad': 35, 'mohali': 42, 'pune': 39,
    'bareilly': 43, 'chennai': 37, 'dehradun': 32, 'indore': 38, 'sonipat': 44,
    'thiruvananthapuram': 36, 'vrindavan': 34, 'greater noida west': 45
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
    'gzb': 'ghaziabad',
    'trivandrum': 'thiruvananthapuram',
    'thrivananthapura': 'thiruvananthapuram',
    'trivendrum': 'thiruvananthapuram',
    'thrivunthapuram': 'thiruvananthapuram',
    'trivandram': 'thiruvananthapuram',
    'trivanthapuram': 'thiruvananthapuram',
    'thirivanthapuram': 'thiruvananthapuram',
    'chenai': 'chennai',
    'dehradoon': 'dehradun',
    'aggra': 'agra'
};

const ALLOWED_CITIES = Object.keys(CITY_MAP).sort((a, b) => b.length - a.length);

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

    if (msg === 'restart' || msg === 'reset' || msg === 'hi' || msg === 'hello' ||
        ['commercial', 'residential', 'new launch'].includes(msg)) {
        session.step = STATES.WELCOME;
        session.data = {};
        session.flags = null;

        // If it's a property type, start the flow immediately at TYPE_SELECTED
        if (['commercial', 'residential', 'new launch'].includes(msg)) {
            session.data.type = msg;
            session.step = STATES.TYPE_SELECTED;
            return {
                reply: `Which city are you interested in?`,
                options: ['Noida', 'Gurugram', 'Ghaziabad', 'Greater Noida', 'Faridabad', 'Delhi', 'Other']
            };
        }

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
                // Unify with robust matching logic
                const allMatchable = [...ALLOWED_CITIES, ...Object.keys(CITY_ALIASES)].sort((a, b) => b.length - a.length);
                let matchedKey = allMatchable.find(k => {
                    const regex = new RegExp(`\\b${k}\\b`, 'i');
                    return regex.test(inputCity);
                });

                let matchedCity = null;
                if (matchedKey) {
                    matchedCity = CITY_MAP[matchedKey] ? matchedKey : CITY_ALIASES[matchedKey];
                }

                let fuzzyMatch = null;
                if (!matchedCity) {
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

                if (matchedCity) {
                    session.data.city = matchedCity;
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

            // Combine map keys and aliases for comprehensive matching
            const allMatchable = [...ALLOWED_CITIES, ...Object.keys(CITY_ALIASES)].sort((a, b) => b.length - a.length);
            let matchedKey = allMatchable.find(k => {
                const regex = new RegExp(`\\b${k}\\b`, 'i');
                return regex.test(inputCity);
            });

            let matchedCity = null;
            if (matchedKey) {
                matchedCity = CITY_MAP[matchedKey] ? matchedKey : CITY_ALIASES[matchedKey];
            }

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
                const cityId = CITY_MAP[session.data.city];

                if (!cityId) {
                    return {
                        reply: `I'm sorry, I couldn't find project data for ${session.data.city}.\nWould you like to try another city?`,
                        options: ['Noida', 'Gurugram', 'Ghaziabad', 'Greater Noida', 'Faridabad', 'Delhi', 'Other']
                    };
                }

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
                const cityName = encodeURIComponent(session.data.city || "");
                const apiBudget = session.data.budget;
                const targetUrl = `https://mypropertyfact.in/projects?propertyType=${typeId}&propertyLocation=${cityId}&cityName=${cityName}&budget=${encodeURIComponent(apiBudget)}`;

                return {
                    reply: `Redirecting you to view more projects on our website...`,
                    redirectUrl: targetUrl
                };
            }

            if (['no', 'no, thanks'].includes(msg)) {
                return {
                    reply: `Thank you for your time!\nHave a great day 😊`,
                    options: ['Restart']
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

let pool = null;
try {
    pool = require('./db');
} catch (_) {
    // db module optional – MySQL storage disabled when not present
}

async function processEnquiry({ name, mobile, email, project, sessionId }) {
    if (!name || !mobile || !email) {
        return { status: 400, data: { success: false, message: 'All fields required' } };
    }

    const session = sessions[sessionId] || { data: {} };
    const { type, city, budget } = session.data || {};

    // 1. Try to save to local MySQL (when db module is present)
    if (pool) {
        try {
            await pool.execute(
                'INSERT INTO form_leads (name, phone, email, project_name, property_type, city, budget) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, mobile, email, project || 'General', type || 'N/A', city || 'N/A', budget || 'N/A']
            );
            console.log('[Lead] Saved to MySQL:', name, mobile);
        } catch (dbErr) {
            console.log('[Lead] MySQL unavailable, skipping local storage:', dbErr.code || dbErr.message);
        }
    }

    // 2. External API Integration
    try {
        const externalResponse = await axios.post('https://apis.mypropertyfact.in/enquiry/post', {
            name: name,
            email: email,
            phone: mobile,
            message: null,
            pageName: null,
            enquiryFrom: null,
            projectLink: project ? `https://mypropertyfact.in/${project.toLowerCase().replace(/\s+/g, '-')}` : "https://www.mypropertyfact.com/contact-us",
            status: "PENDING",
            id: 0
        });

        console.log(`[Lead] External API Response:`, externalResponse.data);

        if (externalResponse.data && externalResponse.data.isSuccess === 1) {
            return {
                status: 200,
                data: {
                    success: true,
                    reply: `Thank you for sharing your details!\nOur consultant will contact you within 24 hours.`,
                    followUp: `Would you like to explore more projects?`,
                    options: ['Yes', 'No']
                }
            };
        } else {
            throw new Error(`External API declined: ${JSON.stringify(externalResponse.data)}`);
        }

    } catch (apiError) {
        console.error("External Enquiry API Failed:", apiError.message);
        return {
            status: 500,
            data: {
                success: false,
                message: 'Submission failed. Please try again.'
            }
        };
    }
}

module.exports = {
    generateAIResponse,
    processEnquiry,
    sessions,
    PROPERTY_TYPE_MAP,
    CITY_MAP,
    STATES
};
