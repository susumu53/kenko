/**
 * 実現健康長寿アプリ — SPA Router
 * Hash-based routing for simple deployment
 */

const Router = (() => {
  const routes = {};
  let currentPage = null;
  let onNavigate = null;

  /**
   * Register a route
   * @param {string} name - Route name (used as hash)
   * @param {object} config - { title, render, onEnter, onLeave }
   */
  function register(name, config) {
    routes[name] = config;
  }

  /**
   * Navigate to a route
   * @param {string} name - Route name
   * @param {object} [params] - Optional parameters
   */
  function navigate(name, params = {}) {
    if (!routes[name]) {
      console.warn(`Router: Unknown route "${name}"`);
      return;
    }

    // Leave current page
    if (currentPage && routes[currentPage] && routes[currentPage].onLeave) {
      routes[currentPage].onLeave();
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));

    // Show target page
    const pageEl = document.getElementById(`page-${name}`);
    if (pageEl) {
      pageEl.classList.add('active');
    }

    // Update nav state
    document.querySelectorAll('.bottom-nav__item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === name);
    });

    // Update hash without triggering hashchange
    const hash = `#${name}`;
    if (window.location.hash !== hash) {
      history.pushState(null, '', hash);
    }

    // Update document title
    if (routes[name].title) {
      document.title = `${routes[name].title} | 実現健康長寿`;
    }

    currentPage = name;

    // Call enter hook
    if (routes[name].onEnter) {
      routes[name].onEnter(params);
    }

    // Notify callback
    if (onNavigate) {
      onNavigate(name, params);
    }
  }

  /**
   * Initialize router: listen for hash changes and navigate to initial route
   */
  function init(defaultRoute = 'home') {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || defaultRoute;
      navigate(hash);
    });

    window.addEventListener('popstate', () => {
      const hash = window.location.hash.slice(1) || defaultRoute;
      navigate(hash);
    });

    // Initial route
    const initial = window.location.hash.slice(1) || defaultRoute;
    navigate(initial);
  }

  /**
   * Set navigation callback
   */
  function setOnNavigate(cb) {
    onNavigate = cb;
  }

  /**
   * Get current route name
   */
  function current() {
    return currentPage;
  }

  return {
    register,
    navigate,
    init,
    setOnNavigate,
    current,
  };
})();
