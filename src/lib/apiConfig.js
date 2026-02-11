/**
 * Versioned API base URL. All backend APIs are under /api/v1.
 * Use this for all API calls so versioning stays in one place.
 */
const getBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005/").replace(/\/?$/, "/");

export const API_BASE = getBase();
export const API_V1 = getBase() + "api/v1/";
