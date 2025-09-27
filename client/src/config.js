const sameOriginApi =
  typeof window !== "undefined" && window.location && window.location.origin
    ? `${window.location.origin}/api`
    : "http://localhost:4000/api";

export const API_URL = process.env.VITE_API_URL || sameOriginApi;
