import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}projects/search-by-type-city-budget`;
const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/`;

const PROPERTY_TYPE_MAP = {
  residential: 1,
  commercial: 2,
  "new launch": 1,
};

const CITY_MAP = {
  agra: 1,
  noida: 2,
  ludhiana: 6,
  mumbai: 14,
  ghaziabad: 15,
  gurugram: 17,
  bangalore: 18,
  jaipur: 19,
  kochi: 20,
  hyderabad: 21,
  "greater noida": 26,
  "noida extension": 27,
  lucknow: 31,
  chandigarh: 33,
  goa: 41,
  delhi: 30,
  faridabad: 35,
  mohali: 42,
  pune: 39,
  bareilly: 43,
  chennai: 37,
  dehradun: 32,
  indore: 38,
  sonipat: 44,
  thiruvananthapuram: 36,
  vrindavan: 34,
  "greater noida west": 45,
};

const CITY_ALIASES = {
  gurgaon: "gurugram",
  benglore: "bangalore",
  banglore: "bangalore",
  bengaluru: "bangalore",
  "new delhi": "delhi",
  "gr noida": "greater noida",
  gzb: "ghaziabad",
  trivandrum: "thiruvananthapuram",
  chenai: "chennai",
  dehradoon: "dehradun",
};

const CITY_OPTIONS = [
  "Noida",
  "Gurugram",
  "Ghaziabad",
  "Greater Noida",
  "Faridabad",
  "Delhi",
  "Other",
];

const BUDGET_OPTIONS = [
  "Up to ₹1 Cr",
  "₹1 Cr – ₹3 Cr",
  "₹3 Cr – ₹5 Cr",
  "Above ₹5 Cr",
];

const RESTART_KEYWORDS = new Set(["restart", "reset", "start over", "start again"]);

const CHAT_STATES = {
  WELCOME: "WELCOME",
  AWAIT_CITY: "AWAIT_CITY",
  AWAIT_CUSTOM_CITY: "AWAIT_CUSTOM_CITY",
  AWAIT_BUDGET: "AWAIT_BUDGET",
  SHOWING_RESULTS: "SHOWING_RESULTS",
};

export function createInitialChatSession() {
  return {
    step: CHAT_STATES.WELCOME,
    data: { type: null, city: null, budget: null },
    results: { allProjects: [], currentIndex: 0 },
  };
}

function normalizeText(value = "") {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeCityInput(rawCity = "") {
  const city = normalizeText(rawCity);
  return CITY_ALIASES[city] || city;
}

function resolvePropertyType(message) {
  const msg = normalizeText(message);
  if (msg.includes("commercial")) return "commercial";
  if (msg.includes("new launch")) return "new launch";
  if (msg.includes("residential")) return "residential";
  return null;
}

function resolveCity(message) {
  const normalizedInput = normalizeCityInput(message);
  if (!normalizedInput) return null;

  const matchable = [...Object.keys(CITY_MAP), ...Object.keys(CITY_ALIASES)].sort(
    (a, b) => b.length - a.length,
  );

  const hit = matchable.find((key) => {
    const regex = new RegExp(`\\b${escapeRegex(key)}\\b`, "i");
    return regex.test(normalizedInput);
  });

  if (!hit) return null;
  return CITY_MAP[hit] ? hit : CITY_ALIASES[hit];
}

function resolveBudget(message) {
  const msg = normalizeText(message);
  const mapped = {
    "up to ₹1 cr": "Up to 1Cr",
    "₹1 cr – ₹3 cr": "1Cr-3Cr",
    "₹3 cr – ₹5 cr": "3Cr-5Cr",
    "above ₹5 cr": "Above 5Cr",
    "up to 1 cr": "Up to 1Cr",
    "upto 1 cr": "Up to 1Cr",
    "1 cr - 3 cr": "1Cr-3Cr",
    "3 cr - 5 cr": "3Cr-5Cr",
    "above 5 cr": "Above 5Cr",
    "above 5cr": "Above 5Cr",
  };
  return mapped[msg] || null;
}

function projectMatchesSelectedCity(project, selectedCity) {
  const normalizedSelectedCity = normalizeCityInput(selectedCity);
  const aliases = [normalizedSelectedCity];
  Object.entries(CITY_ALIASES).forEach(([alias, canonical]) => {
    if (canonical === normalizedSelectedCity) aliases.push(alias);
  });

  const haystack = [project?.cityName, project?.projectAddress]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return aliases.some((variant) => {
    const regex = new RegExp(`\\b${escapeRegex(variant)}\\b`, "i");
    return regex.test(haystack);
  });
}

function buildProjectCards(projects = []) {
  return projects.map((project) => {
    const slug =
      project.projectSlug ||
      String(project.projectName || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const imageFile = project.projectBannerImage || project.projectThumbnailImage;
    const image =
      imageFile && imageFile.startsWith("http")
        ? imageFile
        : imageFile
          ? `${IMAGE_BASE_URL}${slug}/${imageFile}`
          : "https://via.placeholder.com/300x200?text=No+Image";

    return {
      id: project.id,
      name: project.projectName,
      location: project.projectAddress || project.cityName,
      price: project.projectStartingPrice || "Price on Request",
      image,
      builder: project.builderName || "N/A",
      status: project.projectStatusName || "N/A",
      link: `${process.env.NEXT_PUBLIC_UI_URL}/${slug}`,
    };
  });
}

function buildRedirect(data) {
  const typeId = PROPERTY_TYPE_MAP[data.type] || 1;
  const normalizedCity = normalizeCityInput(data.city);
  const cityId = CITY_MAP[normalizedCity];
  const budget = data.budget;
  if (!cityId || !budget) return null;

  const cityName = encodeURIComponent(normalizedCity || "");
  const redirectPath = `/projects?propertyType=${typeId}&propertyLocation=${cityId}&cityName=${cityName}&budget=${encodeURIComponent(budget)}`;
  const uiBase = (process.env.NEXT_PUBLIC_UI_URL || "").replace(/\/$/, "");

  return {
    redirectPath,
    redirectUrl: uiBase ? `${uiBase}${redirectPath}` : redirectPath,
  };
}

function createProjectBatch(session) {
  const start = session.results.currentIndex;
  const end = start + 3;
  const batch = session.results.allProjects.slice(start, end);
  session.results.currentIndex += batch.length;

  const hasMore = session.results.currentIndex < session.results.allProjects.length;
  if (!batch.length) {
    return {
      reply: "No matching projects found. Please refine your search.",
      options: ["Refine Search", "Restart"],
    };
  }

  return {
    reply: start === 0 ? `Here are top projects in ${session.data.city}:` : "Here are more projects:",
    followUp: hasMore ? "Choose what you want next." : "These are all available projects for now.",
    projectCards: buildProjectCards(batch),
    options: hasMore
      ? ["Show More", "View All", "Refine Search", "Restart"]
      : ["View All", "Refine Search", "Restart"],
  };
}

async function fetchProjects(session) {
  const typeId = PROPERTY_TYPE_MAP[session.data.type] || 1;
  const normalizedCity = normalizeCityInput(session.data.city);
  const cityId = CITY_MAP[normalizedCity];

  if (!cityId) {
    return {
      reply: "City mapping not found. Please select city again.",
      options: CITY_OPTIONS,
    };
  }

  const response = await axios.get(API_URL, {
    params: {
      propertyType: typeId,
      propertyLocation: cityId,
      budget: session.data.budget,
    },
  });

  const allProjects = Array.isArray(response.data) ? response.data : [];
  session.results.allProjects = allProjects.filter((project) =>
    projectMatchesSelectedCity(project, normalizedCity),
  );
  session.results.currentIndex = 0;
  session.step = CHAT_STATES.SHOWING_RESULTS;

  return createProjectBatch(session);
}

function handleResultsState(message, session) {
  const msg = normalizeText(message);

  if (["refine search", "change filters"].includes(msg)) {
    session.step = CHAT_STATES.AWAIT_CITY;
    session.data.city = null;
    session.data.budget = null;
    session.results = { allProjects: [], currentIndex: 0 };
    return {
      reply: "Sure, choose city again.",
      options: CITY_OPTIONS,
    };
  }

  if (["show more", "more", "yes"].includes(msg)) {
    return createProjectBatch(session);
  }

  if (["view all", "open all"].includes(msg)) {
    const redirect = buildRedirect(session.data);
    if (!redirect) {
      return { reply: "Redirect link not available. Please restart once.", options: ["Restart"] };
    }
    return {
      reply: "Redirecting you to all matching projects...",
      ...redirect,
    };
  }

  return null;
}

export async function generateClientChatResponse(message, session) {
  const nextSession = structuredClone(session || createInitialChatSession());
  const msg = normalizeText(message);

  if (!msg) {
    return {
      nextSession,
      payload: {
        reply: "Please select your property type to start.",
        options: ["Commercial", "Residential", "New Launch"],
      },
    };
  }

  if (RESTART_KEYWORDS.has(msg)) {
    return {
      nextSession: createInitialChatSession(),
      payload: {
        reply: "Hi 👋\nWelcome to My Property Fact!\n\nTell me your requirement and I will help you shortlist relevant projects.",
        options: ["Commercial", "Residential", "New Launch"],
      },
    };
  }

  if (nextSession.step === CHAT_STATES.SHOWING_RESULTS) {
    const resultPayload = handleResultsState(msg, nextSession);
    if (resultPayload) return { nextSession, payload: resultPayload };
  }

  if (nextSession.step === CHAT_STATES.WELCOME) {
    const propertyType = resolvePropertyType(msg);
    if (!propertyType) {
      return {
        nextSession,
        payload: {
          reply: "Please select your property type to start.",
          options: ["Commercial", "Residential", "New Launch"],
        },
      };
    }

    nextSession.data.type = propertyType;
    nextSession.step = CHAT_STATES.AWAIT_CITY;
    return {
      nextSession,
      payload: {
        reply: "Great choice. Which city are you interested in?",
        options: CITY_OPTIONS,
      },
    };
  }

  if (nextSession.step === CHAT_STATES.AWAIT_CITY) {
    if (msg === "other") {
      nextSession.step = CHAT_STATES.AWAIT_CUSTOM_CITY;
      return {
        nextSession,
        payload: { reply: "Please type your preferred city name.", options: [] },
      };
    }

    const city = resolveCity(msg);
    if (!city) {
      return {
        nextSession,
        payload: {
          reply: "City not recognized. Please select from options or choose Other.",
          options: CITY_OPTIONS,
        },
      };
    }

    nextSession.data.city = city;
    nextSession.step = CHAT_STATES.AWAIT_BUDGET;
    return {
      nextSession,
      payload: { reply: "Perfect. What is your budget range?", options: BUDGET_OPTIONS },
    };
  }

  if (nextSession.step === CHAT_STATES.AWAIT_CUSTOM_CITY) {
    const city = resolveCity(msg);
    if (!city) {
      return {
        nextSession,
        payload: {
          reply: "I do not have mapped data for this city right now. Please choose from list.",
          options: CITY_OPTIONS,
        },
      };
    }

    nextSession.data.city = city;
    nextSession.step = CHAT_STATES.AWAIT_BUDGET;
    return {
      nextSession,
      payload: { reply: "Perfect. What is your budget range?", options: BUDGET_OPTIONS },
    };
  }

  if (nextSession.step === CHAT_STATES.AWAIT_BUDGET) {
    const budget = resolveBudget(msg);
    if (!budget) {
      return {
        nextSession,
        payload: {
          reply: "Please select one budget option to continue.",
          options: BUDGET_OPTIONS,
        },
      };
    }

    nextSession.data.budget = budget;
    try {
      const payload = await fetchProjects(nextSession);
      return { nextSession, payload };
    } catch (error) {
      console.error("Client chatbot fetch failed:", error);
      return {
        nextSession,
        payload: {
          reply: "Something went wrong while fetching projects.",
          options: ["Restart"],
        },
      };
    }
  }

  return {
    nextSession: createInitialChatSession(),
    payload: {
      reply: "Let us start again.",
      options: ["Commercial", "Residential", "New Launch"],
    },
  };
}
