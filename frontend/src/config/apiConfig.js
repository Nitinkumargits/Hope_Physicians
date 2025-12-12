/**
 * Centralized API Configuration
 * Auto-detects API URL based on environment
 * Production: Uses Nginx reverse proxy (/api)
 * Development: Uses direct backend (localhost:5000/api)
 */

// Get API URL from runtime config (window.APP_CONFIG) or environment variable
// This allows changing API URL without rebuilding
const getApiUrl = () => {
  // Priority 1: Runtime config from window (set in index.html or config.js)
  if (
    typeof window !== "undefined" &&
    window.APP_CONFIG &&
    window.APP_CONFIG.API_URL
  ) {
    return window.APP_CONFIG.API_URL;
  }

  // Priority 2: Environment variable (set at build time)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Priority 3: Auto-detect based on current host
  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    // Production server - Use Nginx reverse proxy (recommended)
    if (host === "52.66.236.157" || host.includes("52.66.236.157")) {
      // Use relative path for Nginx proxy (best practice)
      // This avoids firewall issues and is more secure
      return "/api";
    }
    // Development - Use direct backend
    else if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    // Default: Use relative path (assumes Nginx proxy)
    else {
      return "/api";
    }
  }

  // Fallback: localhost for development
  return "http://localhost:5000/api";
};

// Export the API base URL
export const API_BASE_URL = getApiUrl();

// Log API URL for debugging (only in development)
if (typeof window !== "undefined" && import.meta.env.DEV) {
  console.log("🔗 API Base URL:", API_BASE_URL);
}

// Export default for convenience
export default API_BASE_URL;
