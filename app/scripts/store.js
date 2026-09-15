/**
 * 実現健康長寿アプリ — Data Store
 * localStorage with extensible architecture for future backend integration
 */

const Store = (() => {
  const STORAGE_KEY = 'kenko_app_data';
  const SCHEMA_VERSION = 1;

  // Default state structure
  const defaultState = () => ({
    _schemaVersion: SCHEMA_VERSION,
    profile: {
      name: '',
      age: null,
      gender: '',
      prefecture: '',
      municipality: '',
      createdAt: null,
      onboardingComplete: false,
    },
    selfCheck: {
      latestResult: null,    // { date, scores, kenkoIndex, bioAge, frailtyStatus }
      history: [],            // Array of results over time
    },
    dailyLogs: {
      // Keyed by date string 'YYYY-MM-DD'
      // Each entry: { steps, sleepHours, vegetableServings, socialOutings, mood, weight, bloodPressure, notes }
    },
    goals: {
      steps: 8000,
      sleepHours: 7,
      vegetableGrams: 350,
      socialOutingsPerWeek: 3,
    },
    education: {
      completedLessons: [],
      quizScores: {},
      bookmarks: [],
    },
    community: {
      savedResources: [],
      interests: [],
      recentSearches: [],
    },
    settings: {
      theme: 'light',  // 'light' | 'dark' | 'auto'
      fontSize: 'normal', // 'normal' | 'large' | 'xlarge'
      notifications: true,
    },
  });

  let _state = null;
  let _listeners = [];

  /**
   * Initialize the store: load from localStorage or create default
   */
  function init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed._schemaVersion === SCHEMA_VERSION) {
          _state = _mergeDefaults(parsed, defaultState());
        } else {
          // Migration placeholder
          _state = _migrate(parsed);
        }
      } else {
        _state = defaultState();
      }
    } catch (e) {
      console.warn('Store: Failed to load from localStorage, using defaults', e);
      _state = defaultState();
    }
    _applySettings();
    return _state;
  }

  /**
   * Merge stored data with defaults (preserves stored values, adds new default keys)
   */
  function _mergeDefaults(stored, defaults) {
    const result = { ...defaults };
    for (const key of Object.keys(defaults)) {
      if (key in stored) {
        if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
          result[key] = _mergeDefaults(stored[key] || {}, defaults[key]);
        } else {
          result[key] = stored[key];
        }
      }
    }
    return result;
  }

  /**
   * Schema migration placeholder
   */
  function _migrate(oldData) {
    console.log('Store: Migrating from schema version', oldData._schemaVersion, 'to', SCHEMA_VERSION);
    // For now, reset to defaults
    return defaultState();
  }

  /**
   * Save current state to localStorage
   */
  function _persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
    } catch (e) {
      console.error('Store: Failed to persist state', e);
    }
  }

  /**
   * Apply settings (theme, font size)
   */
  function _applySettings() {
    const { theme, fontSize } = _state.settings;

    // Theme
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // Font size
    const fontSizeMap = { normal: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.fontSize = fontSizeMap[fontSize] || '16px';
  }

  /**
   * Get the full state or a nested path
   * @param {string} [path] - Dot-separated path e.g. 'profile.name'
   */
  function get(path) {
    if (!_state) init();
    if (!path) return _state;

    return path.split('.').reduce((obj, key) => {
      return obj && typeof obj === 'object' ? obj[key] : undefined;
    }, _state);
  }

  /**
   * Set a value at a nested path
   * @param {string} path - Dot-separated path
   * @param {*} value - Value to set
   */
  function set(path, value) {
    if (!_state) init();

    const keys = path.split('.');
    let obj = _state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in obj) || typeof obj[keys[i]] !== 'object') {
        obj[keys[i]] = {};
      }
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;

    _persist();
    _notifyListeners(path, value);
  }

  /**
   * Update a nested object (shallow merge)
   * @param {string} path
   * @param {object} updates
   */
  function update(path, updates) {
    const current = get(path);
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      set(path, { ...current, ...updates });
    } else {
      set(path, updates);
    }
  }

  /**
   * Record a daily log entry
   * @param {string} date - 'YYYY-MM-DD'
   * @param {object} data
   */
  function logDaily(date, data) {
    if (!_state) init();
    const existing = _state.dailyLogs[date] || {};
    _state.dailyLogs[date] = { ...existing, ...data, _updatedAt: new Date().toISOString() };
    _persist();
    _notifyListeners('dailyLogs', _state.dailyLogs);
  }

  /**
   * Get daily log entries for a date range
   * @param {number} [days=7] - Number of past days
   */
  function getDailyLogs(days = 7) {
    if (!_state) init();
    const logs = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      logs.push({
        date: dateStr,
        ..._state.dailyLogs[dateStr] || {},
      });
    }
    return logs.reverse();
  }

  /**
   * Get today's date as string
   */
  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Subscribe to state changes
   * @param {function} listener - Called with (path, value) on change
   * @returns {function} Unsubscribe function
   */
  function subscribe(listener) {
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter(l => l !== listener);
    };
  }

  function _notifyListeners(path, value) {
    _listeners.forEach(l => {
      try { l(path, value); } catch (e) { console.error('Store listener error:', e); }
    });
  }

  /**
   * Export all data as JSON
   */
  function exportData() {
    return JSON.stringify(_state, null, 2);
  }

  /**
   * Import data from JSON string
   */
  function importData(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data._schemaVersion === SCHEMA_VERSION) {
        _state = _mergeDefaults(data, defaultState());
        _persist();
        _applySettings();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Store: Import failed', e);
      return false;
    }
  }

  /**
   * Reset all data
   */
  function reset() {
    _state = defaultState();
    _persist();
    _applySettings();
  }

  return {
    init,
    get,
    set,
    update,
    logDaily,
    getDailyLogs,
    today,
    subscribe,
    exportData,
    importData,
    reset,
  };
})();
