export const getAuthToken = () => localStorage.getItem("authToken");

export const getAuthRole = () => localStorage.getItem("authRole");

export const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getJwtPayload = () => {
    const token = getAuthToken();
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const json = atob(padded);
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const getEnrollmentNo = () => getJwtPayload()?.enrollmentNo || "";
