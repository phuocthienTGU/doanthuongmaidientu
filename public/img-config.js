// Central image base URL for frontend
// Change this when deploying to a different backend host
// Default; can be overridden in production
window.IMG_BASE = window.IMG_BASE || "http://localhost:5000/images";

// API base for frontend requests (host only, add "/api" when building URLs)
window.API_BASE = window.API_BASE || "http://localhost:5000";

// Helper for older pages: ensure a local constant exists when scripts run
try {
  if (typeof IMG_BASE === "undefined") {
    // define global constant in window scope for inline scripts
    Object.defineProperty(window, "IMG_BASE", {
      value: window.IMG_BASE,
      configurable: true,
      writable: true,
    });
  }
} catch (e) {
  // ignore
}
