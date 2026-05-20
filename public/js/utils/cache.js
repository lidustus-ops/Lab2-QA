// Cache utility for in-memory and localStorage caching

class Cache {
  constructor() {
    this.memoryCache = new Map();
    this.storageKey = 'it-courses-cache';
    this.loadFromStorage();
  }

  // Load cache from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.memoryCache = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  }

  // Save cache to localStorage
  saveToStorage() {
    try {
      const data = Object.fromEntries(this.memoryCache);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  // Get value from cache
  get(key) {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    // Check if expired
    if (item.expiry && Date.now() > item.expiry) {
      this.memoryCache.delete(key);
      this.saveToStorage();
      return null;
    }

    return item.value;
  }

  // Set value in cache
  set(key, value, ttl = null) {
    const item = {
      value,
      expiry: ttl ? Date.now() + ttl : null,
    };

    this.memoryCache.set(key, item);
    this.saveToStorage();
    return item;
  }

  // Remove value from cache
  remove(key) {
    this.memoryCache.delete(key);
    this.saveToStorage();
  }

  // Clear all cache
  clear() {
    this.memoryCache.clear();
    localStorage.removeItem(this.storageKey);
  }

  // Check if key exists and is valid
  has(key) {
    const item = this.memoryCache.get(key);
    if (!item) return false;

    if (item.expiry && Date.now() > item.expiry) {
      this.memoryCache.delete(key);
      this.saveToStorage();
      return false;
    }

    return true;
  }
}

// Export singleton instance
const cache = new Cache();
window.cache = cache;

