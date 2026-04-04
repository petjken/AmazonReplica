/** Base URL for Books API (no trailing slash). Override with VITE_API_URL at build time. */
export const API_BOOKS_BASE =
    import.meta.env.VITE_API_URL ??
    "https://amazonreplicacanada-c4c2h4cjeuataahf.canadacentral-01.azurewebsites.net/Books";
