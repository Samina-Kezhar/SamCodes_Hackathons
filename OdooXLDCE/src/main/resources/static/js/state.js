/**
 * GlobeTrotter Centralized State Management Store
 * Reactive state with local storage persistence and event emitter.
 */

class StateStore {
  constructor() {
    this.listeners = {};
    this.user = this.loadUser();
    this.trips = this.loadTrips();
    this.settings = this.loadSettings();
    this.wishlist = this.loadWishlist();
    this.currentTripId = this.trips.length > 0 ? this.trips[0].id : null;
    this.currentView = 'dashboard';
    this.activeSearchFilters = { query: '', region: 'all', category: 'all', maxCost: 300 };
  }

  loadUser() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY_USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse user from localStorage', e);
    }
    // Default demo user Alex River
    const defaultUser = {
      id: 'usr-demo-01',
      name: 'Alex River',
      email: 'alex.river@globetrotter.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      bio: 'Avid explorer, foodie, and landscape photographer. 24 countries & counting! 🌍',
      homeCurrency: 'USD',
      preferredLanguage: 'English (US)',
      isLoggedIn: true,
      registeredAt: '2026-01-15'
    };
    this.saveUser(defaultUser);
    return defaultUser;
  }

  loadTrips() {
    const userKey = this.user ? this.user.email : 'default';
    const namespacedKey = CONFIG.STORAGE_KEY_TRIPS + '_' + userKey;
    try {
      const stored = localStorage.getItem(namespacedKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      
      const legacy = localStorage.getItem(CONFIG.STORAGE_KEY_TRIPS);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (userKey !== 'alex.river@globetrotter.io') {
            localStorage.removeItem(CONFIG.STORAGE_KEY_TRIPS);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse trips from localStorage', e);
    }
    
    const initial = userKey === 'alex.river@globetrotter.io' ? JSON.parse(JSON.stringify(CONFIG.INITIAL_SEED_TRIPS)) : [];
    return initial;
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY_SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse settings', e);
    }
    return {
      theme: 'dark',
      useDestinationTimeZone: true,
      simulateSlowNetwork: false,
      simulateConflictWarning: true
    };
  }

  loadWishlist() {
    const userKey = this.user ? this.user.email : 'default';
    const namespacedKey = CONFIG.STORAGE_KEY_WISHLIST + '_' + userKey;
    try {
      const stored = localStorage.getItem(namespacedKey);
      if (stored) return JSON.parse(stored);
      
      const legacy = localStorage.getItem(CONFIG.STORAGE_KEY_WISHLIST);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (userKey !== 'alex.river@globetrotter.io') {
          localStorage.removeItem(CONFIG.STORAGE_KEY_WISHLIST);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse wishlist', e);
    }
    return userKey === 'alex.river@globetrotter.io' ? ['dest-tokyo', 'dest-bali', 'dest-zurich'] : [];
  }

  saveTrips(trips = this.trips) {
    this.trips = trips;
    const userKey = this.user ? this.user.email : 'default';
    localStorage.setItem(CONFIG.STORAGE_KEY_TRIPS + '_' + userKey, JSON.stringify(this.trips));
    this.emit('trips:updated', this.trips);
  }

  saveUser(user = this.user) {
    this.user = user;
    localStorage.setItem(CONFIG.STORAGE_KEY_USER, JSON.stringify(this.user));
    this.emit('user:updated', this.user);
  }

  switchUser(user) {
    this.saveUser(user);
    this.trips = this.loadTrips();
    this.wishlist = this.loadWishlist();
    this.saveTrips(this.trips);
    this.saveWishlist(this.wishlist);
  }

  saveSettings(settings = this.settings) {
    this.settings = settings;
    localStorage.setItem(CONFIG.STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    this.emit('settings:updated', this.settings);
  }

  saveWishlist(wishlist = this.wishlist) {
    this.wishlist = wishlist;
    const userKey = this.user ? this.user.email : 'default';
    localStorage.setItem(CONFIG.STORAGE_KEY_WISHLIST + '_' + userKey, JSON.stringify(this.wishlist));
    this.emit('wishlist:updated', this.wishlist);
  }

  // Active Trip Accessors
  getCurrentTrip() {
    if (!this.currentTripId && this.trips.length > 0) {
      this.currentTripId = this.trips[0].id;
    }
    return this.trips.find(t => t.id === this.currentTripId) || this.trips[0] || null;
  }

  setCurrentTripId(tripId) {
    this.currentTripId = tripId;
    this.emit('currentTrip:changed', this.getCurrentTrip());
  }

  // Pub / Sub Pattern
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  // Reset to initial seed demo state
  resetToDemo() {
    localStorage.removeItem(CONFIG.STORAGE_KEY_TRIPS);
    localStorage.removeItem(CONFIG.STORAGE_KEY_USER);
    localStorage.removeItem(CONFIG.STORAGE_KEY_SETTINGS);
    localStorage.removeItem(CONFIG.STORAGE_KEY_WISHLIST);
    this.user = this.loadUser();
    this.trips = this.loadTrips();
    this.settings = this.loadSettings();
    this.wishlist = this.loadWishlist();
    this.currentTripId = this.trips[0]?.id || null;
    this.emit('app:reset', true);
  }
}

// Global singleton
window.AppStore = new StateStore();
