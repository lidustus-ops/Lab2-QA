// Simple hash router

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.init();
  }

  init() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Handle initial route
    this.handleRoute();
  }

  // Register a route
  route(path, handler) {
    this.routes.set(path, handler);
  }

  // Handle current route
  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, ...params] = hash.split('/');
    const routePath = `/${path}`;

    // Find matching route
    let handler = this.routes.get(routePath);
    
    // Try exact match first
    if (!handler) {
      // Try pattern matching (e.g., /item/:id)
      for (const [route, routeHandler] of this.routes.entries()) {
        const pattern = this.matchPattern(route, routePath);
        if (pattern) {
          handler = routeHandler;
          params.push(...pattern.params);
          break;
        }
      }
    }

    if (handler) {
      this.currentRoute = { path: routePath, params };
      handler(...params);
    } else {
      console.warn(`No route found for: ${routePath}`);
    }
  }

  // Match route pattern (e.g., /item/:id)
  matchPattern(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }

    return { params: Object.values(params) };
  }

  // Navigate to a route
  navigate(path) {
    window.location.hash = path;
  }

  // Get current route
  getCurrentRoute() {
    return this.currentRoute;
  }

  // Get query parameters from URL
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return result;
  }

  // Update URL without navigation (for state sync)
  updateState(path, replace = false) {
    if (replace) {
      window.history.replaceState(null, '', `#${path}`);
    } else {
      window.location.hash = path;
    }
  }
}

// Export singleton instance
const router = new Router();
window.router = router;

