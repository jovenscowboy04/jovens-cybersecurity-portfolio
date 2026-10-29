/**
 * Theme Engine for Cyber-Gotham Portfolio
 * Supports 6 custom colorway presets with localStorage persistence
 * and dynamic Jovens AI integration.
 */

const VALID_THEMES = {
  gotham: { name: "Gotham Night (Default)", color: "#00e5ff" },
  purple: { name: "Cyberpunk Purple", color: "#b347ff" },
  matrix: { name: "Matrix Hacker Green", color: "#00ff66" },
  "red-alert": { name: "Red Alert Emergency", color: "#ff2244" },
  ice: { name: "Arctic Ice Cyber", color: "#66e6ff" },
  gold: { name: "Gotham Gold Luxury", color: "#ffd700" }
};

const THEME_STORAGE_KEY = "batcomputer_theme";

/**
 * Apply theme to document
 * @param {string} themeKey 
 * @param {boolean} persist 
 * @returns {boolean} success
 */
function applyTheme(themeKey, persist = true) {
  if (!VALID_THEMES[themeKey]) {
    console.warn(`[ThemeEngine] Unrecognized theme: "${themeKey}". Defaulting to "gotham".`);
    themeKey = "gotham";
  }

  // Set attribute on html and body for full CSS selector coverage
  document.documentElement.setAttribute("data-theme", themeKey);
  if (document.body) {
    document.body.setAttribute("data-theme", themeKey);
  }

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeKey);
    } catch (e) {
      console.warn("[ThemeEngine] Unable to save theme to localStorage:", e);
    }
  }

  // Dispatch custom event for Jovens AI or UI components
  window.dispatchEvent(new CustomEvent("themechange", {
    detail: {
      theme: themeKey,
      meta: VALID_THEMES[themeKey]
    }
  }));

  return true;
}

/**
 * Get current active theme
 */
function getCurrentTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && VALID_THEMES[saved]) return saved;
  } catch (e) {
    // Ignore storage errors
  }
  return document.documentElement.getAttribute("data-theme") || "gotham";
}

/**
 * Initialize theme immediately to prevent visual flash
 */
(function initTheme() {
  const current = getCurrentTheme();
  document.documentElement.setAttribute("data-theme", current);
  document.addEventListener("DOMContentLoaded", () => {
    if (document.body) {
      document.body.setAttribute("data-theme", current);
    }
  });
})();

// Expose globally
window.applyTheme = applyTheme;
window.getCurrentTheme = getCurrentTheme;
window.VALID_THEMES = VALID_THEMES;
