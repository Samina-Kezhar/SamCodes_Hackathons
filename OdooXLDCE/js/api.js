/**
 * GlobeTrotter Spring Boot REST API Client & Intelligent Itinerary Generation Engine
 * Connects to live Spring Boot REST API endpoints, with comprehensive offline fallback
 * and smart day-by-day itinerary auto-generation (images, times, locations, activities).
 */

class ApiClient {
  constructor() {
    this.baseUrl = 'http://localhost:8080/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    this.isBackendAvailable = null;
  }

  async _fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const fetchOptions = {
      ...options,
      headers: { ...this.defaultHeaders, ...options.headers },
      credentials: 'same-origin'
    };

    try {
      const response = await fetch(url, fetchOptions);
      this.isBackendAvailable = true;

      // Handle Unauthorized
      if (response.status === 401 || response.status === 403) {
        if (typeof AppStore !== 'undefined' && AppStore.user) {
          AppStore.saveUser({ ...AppStore.user, isLoggedIn: false });
          if (typeof AppRouter !== 'undefined') AppRouter.navigate('auth');
          Utils.showToast('Session expired. Please log in again.', 'warning');
        }
        throw { status: response.status, message: 'Unauthorized. Please login.' };
      }

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        if (!isJson) {
          this.isBackendAvailable = false;
          throw { status: 0, isNetworkError: true, message: 'Backend service offline. Using local storage.' };
        }
        throw { status: response.status, message: data?.message || `HTTP Error ${response.status}` };
      }

      return { status: response.status, data };
    } catch (error) {
      if (error.name === 'TypeError' || error.message?.includes('fetch') || !navigator.onLine) {
        this.isBackendAvailable = false;
        throw { status: 0, isNetworkError: true, message: 'Backend service offline or unreachable. Using local storage.' };
      }
      throw error;
    }
  }

  // Auth Endpoints
  async login(email, password) {
    try {
      const res = await this._fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const user = {
        id: 'usr-' + btoa(email).slice(0, 10),
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        avatar: CONFIG.AVATAR_PRESETS[0],
        bio: 'Explorer ready for new adventures! 🌍',
        homeCurrency: 'USD',
        preferredLanguage: 'English (US)',
        isLoggedIn: true
      };
      AppStore.switchUser(user);
      return { status: 200, data: user };
    } catch (err) {
      if (err.isNetworkError || err.status === 0) {
        const user = {
          id: 'usr-' + btoa(email).slice(0, 10),
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email,
          avatar: CONFIG.AVATAR_PRESETS[0],
          bio: 'Explorer ready for new adventures! 🌍',
          homeCurrency: 'USD',
          preferredLanguage: 'English (US)',
          isLoggedIn: true
        };
        AppStore.switchUser(user);
        return { status: 200, data: user };
      }
      throw err;
    }
  }

  async signup(name, email, password) {
    if (email.toLowerCase().includes('taken') || email.toLowerCase() === 'existing@example.com') {
      throw { status: 409, message: `The email address '${email}' is already registered. Please login instead.` };
    }

    try {
      await this._fetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
    } catch (err) {
      if (!err.isNetworkError && err.status === 409) throw err;
    }

    const newUser = {
      id: 'usr-' + btoa(email).slice(0, 10),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar: CONFIG.AVATAR_PRESETS[0],
      bio: 'New explorer eager to chart custom routes! 🌍',
      homeCurrency: 'USD',
      preferredLanguage: 'English (US)',
      isLoggedIn: true,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    
    AppStore.switchUser(newUser);
    AppStore.trips = [];
    AppStore.saveTrips(AppStore.trips);
    
    return { status: 201, data: newUser };
  }

  // Trip Endpoints
  async getTrips() {
    try {
      const res = await this._fetch('/trips');
      if (Array.isArray(res.data) && res.data.length > 0) {
        const frontendTrips = await Promise.all(res.data.map(async trip => this._transformBackendTrip(trip)));
        AppStore.trips = frontendTrips;
        return { status: 200, data: frontendTrips };
      }
    } catch (err) {}
    return { status: 200, data: [...AppStore.trips] };
  }

  async getTripById(tripId) {
    try {
      const res = await this._fetch(`/trips/${tripId}`);
      if (res.data) {
        return { status: 200, data: await this._transformBackendTrip(res.data) };
      }
    } catch (err) {}
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) throw { status: 404, message: `Trip '${tripId}' not found.` };
    return { status: 200, data: JSON.parse(JSON.stringify(trip)) };
  }

  /**
   * Creates a new trip with optional automated day-by-day itinerary generation
   */
  async createTrip(tripData) {
    const shouldAutoGenerate = tripData.autoGenerate !== false;
    let days;

    if (shouldAutoGenerate) {
      days = this._generateAutoItinerary(
        tripData.destination,
        tripData.startDate,
        tripData.endDate,
        tripData.budget,
        tripData.tags
      );
    } else {
      days = this._generateDaysBetween(tripData.startDate, tripData.endDate, tripData.destination);
    }

    const newTrip = {
      id: 'trip-' + Date.now(),
      title: tripData.title || `Journey to ${tripData.destination}`,
      description: tripData.description || `A curated ${days.length}-day travel itinerary exploring the wonders of ${tripData.destination}.`,
      destination: tripData.destination || 'Global',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      budget: Number(tripData.budget) || (days.length * 180),
      currency: tripData.currency || AppStore.user?.homeCurrency || 'USD',
      coverImage: tripData.coverImage || this._matchDestinationCover(tripData.destination),
      tags: tripData.tags || ['Culture', 'Adventure'],
      stops: tripData.stops || [
        {
          id: 'stop-' + Date.now(),
          cityName: tripData.destination || 'Main Destination',
          country: this._extractCountry(tripData.destination),
          arrivalDate: tripData.startDate,
          departureDate: tripData.endDate,
          timeZone: 'UTC'
        }
      ],
      days: days
    };

    try {
      const res = await this._fetch('/trips', {
        method: 'POST',
        body: JSON.stringify({
          name: newTrip.title,
          description: JSON.stringify({
            desc: newTrip.description,
            dest: newTrip.destination,
            budget: newTrip.budget,
            currency: newTrip.currency
          }),
          startDate: newTrip.startDate,
          endDate: newTrip.endDate,
          coverPhoto: newTrip.coverImage
        })
      });
      if (res.data?.id) newTrip.id = res.data.id;
    } catch (err) {}

    const updated = [newTrip, ...AppStore.trips];
    AppStore.saveTrips(updated);
    AppStore.setCurrentTripId(newTrip.id);
    return { status: 201, data: newTrip };
  }

  async updateTrip(tripId, updateData) {
    const index = AppStore.trips.findIndex(t => t.id === tripId);
    if (index === -1) throw { status: 404, message: 'Trip not found.' };

    const currentTrip = AppStore.trips[index];
    if (updateData.startDate && updateData.endDate && 
       (updateData.startDate !== currentTrip.startDate || updateData.endDate !== currentTrip.endDate)) {
      currentTrip.days = this._adjustDaysForDateRange(currentTrip.days, updateData.startDate, updateData.endDate, updateData.destination || currentTrip.destination);
    }

    const updatedTrip = { ...currentTrip, ...updateData };
    AppStore.trips[index] = updatedTrip;
    AppStore.saveTrips(AppStore.trips);

    try {
      await this._fetch(`/trips/${tripId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: updatedTrip.title,
          description: JSON.stringify({
            desc: updatedTrip.description,
            dest: updatedTrip.destination,
            budget: updatedTrip.budget,
            currency: updatedTrip.currency
          }),
          startDate: updatedTrip.startDate,
          endDate: updatedTrip.endDate,
          coverPhoto: updatedTrip.coverImage
        })
      });
    } catch (e) {}

    return { status: 200, data: updatedTrip };
  }

  async deleteTrip(tripId) {
    try {
      await this._fetch(`/trips/${tripId}`, { method: 'DELETE' });
    } catch (e) {}

    const filtered = AppStore.trips.filter(t => t.id !== tripId);
    AppStore.saveTrips(filtered);
    if (AppStore.currentTripId === tripId) {
      AppStore.currentTripId = filtered[0]?.id || null;
    }
    return { status: 200, message: 'Trip deleted.' };
  }

  async cloneTrip(tripId) {
    const original = AppStore.trips.find(t => t.id === tripId);
    if (!original) throw { status: 404, message: 'Trip not found to clone.' };

    const cloned = JSON.parse(JSON.stringify(original));
    cloned.id = 'trip-copy-' + Date.now();
    cloned.title = `${original.title} (Copy)`;

    const updated = [cloned, ...AppStore.trips];
    AppStore.saveTrips(updated);
    AppStore.setCurrentTripId(cloned.id);
    return { status: 201, data: cloned };
  }

  // Regenerate / auto-populate activities for a trip
  async regenerateItinerary(tripId, destination, startDate, endDate) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) throw { status: 404, message: 'Trip not found.' };

    const dest = destination || trip.destination;
    const start = startDate || trip.startDate;
    const end = endDate || trip.endDate;

    const newDays = this._generateAutoItinerary(dest, start, end, trip.budget, trip.tags);
    trip.days = newDays;
    trip.startDate = start;
    trip.endDate = end;
    trip.destination = dest;

    AppStore.saveTrips(AppStore.trips);
    return { status: 200, data: trip };
  }

  // Activity Endpoints
  async addActivity(tripId, dayNumber, activityData) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) throw { status: 404, message: 'Trip not found.' };

    let day = trip.days.find(d => d.dayNumber === dayNumber);
    if (!day) {
      day = { dayNumber, date: trip.startDate, city: trip.destination, activities: [] };
      trip.days.push(day);
      trip.days.sort((a, b) => a.dayNumber - b.dayNumber);
    }

    const defaultImg = this._getCategoryDefaultImage(activityData.category || 'sightseeing');

    const newActivity = {
      id: 'act-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: activityData.name || 'New Activity',
      category: activityData.category || 'sightseeing',
      startTime: activityData.startTime || '10:00',
      endTime: activityData.endTime || '12:00',
      cost: Number(activityData.cost) || 0,
      notes: activityData.notes || '',
      location: activityData.location || `${trip.destination}`,
      image: activityData.image || defaultImg
    };

    day.activities.push(newActivity);
    AppStore.saveTrips(AppStore.trips);
    return { status: 201, data: newActivity };
  }

  async updateActivity(tripId, dayNumber, activityId, activityData) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) throw { status: 404, message: 'Trip not found.' };

    const day = trip.days.find(d => d.dayNumber === dayNumber);
    if (!day) throw { status: 404, message: 'Day not found.' };

    const actIndex = day.activities.findIndex(a => a.id === activityId);
    if (actIndex === -1) throw { status: 404, message: 'Activity not found.' };

    day.activities[actIndex] = { ...day.activities[actIndex], ...activityData };
    AppStore.saveTrips(AppStore.trips);
    return { status: 200, data: day.activities[actIndex] };
  }

  async deleteActivity(tripId, dayNumber, activityId) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) throw { status: 404, message: 'Trip not found.' };

    const day = trip.days.find(d => d.dayNumber === dayNumber);
    if (!day) throw { status: 404, message: 'Day not found.' };

    day.activities = day.activities.filter(a => a.id !== activityId);
    AppStore.saveTrips(AppStore.trips);
    return { status: 200, message: 'Activity removed.' };
  }

  // =========================================================================
  // Intelligent Itinerary Auto-Generation Engine
  // =========================================================================

  /**
   * Generates a rich, non-overlapping day-by-day itinerary with images,
   * realistic times, authentic locations, categories, and costs.
   */
  _generateAutoItinerary(destinationStr, startDateStr, endDateStr, budget = 2000, tags = []) {
    const days = [];
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.max(0, end - start);
    const numDays = Math.min(30, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const destLower = (destinationStr || '').toLowerCase();
    const matchedCityActivities = CONFIG.ACTIVITIES_CATALOG.filter(a => 
      destLower.includes(a.cityName.toLowerCase()) || 
      (a.location && destLower.includes(a.location.toLowerCase())) ||
      destLower.includes(a.cityId.replace('dest-', ''))
    );

    // Activity templates for custom destinations or multi-day scaling
    const archetypes = this._getDestinationArchetypes(destinationStr);

    for (let dayIdx = 0; dayIdx < numDays; dayIdx++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + dayIdx);
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayNumber = dayIdx + 1;
      const dayActivities = [];

      if (matchedCityActivities.length > 0) {
        // Build structured schedule from catalog
        const morningAct = matchedCityActivities[(dayIdx * 3) % matchedCityActivities.length];
        const afternoonAct = matchedCityActivities[(dayIdx * 3 + 1) % matchedCityActivities.length];
        const eveningAct = matchedCityActivities[(dayIdx * 3 + 2) % matchedCityActivities.length];

        if (dayNumber === 1) {
          // Day 1: Afternoon Arrival & Checkin, Sunset Dinner & Evening Walk
          dayActivities.push({
            id: `gen-${dayNumber}-1`,
            name: `${destinationStr.split(',')[0]} Welcome & Hotel Check-in`,
            category: 'stay',
            startTime: '14:00',
            endTime: '15:30',
            cost: Math.round(budget / (numDays * 2)),
            image: morningAct?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            location: `Central ${destinationStr}`,
            notes: 'Check-in, refresh, and receive local neighborhood transit passes.'
          });

          if (afternoonAct) {
            dayActivities.push({
              id: `gen-${dayNumber}-2`,
              name: afternoonAct.name,
              category: afternoonAct.category,
              startTime: '16:30',
              endTime: '18:30',
              cost: afternoonAct.cost,
              image: afternoonAct.image,
              location: afternoonAct.location || destinationStr,
              notes: afternoonAct.description
            });
          }

          if (eveningAct) {
            dayActivities.push({
              id: `gen-${dayNumber}-3`,
              name: eveningAct.name,
              category: eveningAct.category || 'food',
              startTime: '19:30',
              endTime: '21:30',
              cost: eveningAct.cost,
              image: eveningAct.image,
              location: eveningAct.location || destinationStr,
              notes: eveningAct.description
            });
          }
        } else {
          // Days 2+: Full 3-4 block day
          if (morningAct) {
            dayActivities.push({
              id: `gen-${dayNumber}-1`,
              name: morningAct.name,
              category: morningAct.category,
              startTime: '09:30',
              endTime: '12:00',
              cost: morningAct.cost,
              image: morningAct.image,
              location: morningAct.location || destinationStr,
              notes: morningAct.description
            });
          }

          if (afternoonAct) {
            dayActivities.push({
              id: `gen-${dayNumber}-2`,
              name: afternoonAct.name,
              category: afternoonAct.category,
              startTime: '13:30',
              endTime: '16:30',
              cost: afternoonAct.cost,
              image: afternoonAct.image,
              location: afternoonAct.location || destinationStr,
              notes: afternoonAct.description
            });
          }

          if (eveningAct) {
            dayActivities.push({
              id: `gen-${dayNumber}-3`,
              name: eveningAct.name,
              category: eveningAct.category,
              startTime: '18:00',
              endTime: '20:30',
              cost: eveningAct.cost,
              image: eveningAct.image,
              location: eveningAct.location || destinationStr,
              notes: eveningAct.description
            });
          }
        }
      } else {
        // Generate contextual activities from archetypes
        const plan = archetypes[dayIdx % archetypes.length];
        plan.forEach((item, actIdx) => {
          dayActivities.push({
            id: `gen-custom-${dayNumber}-${actIdx + 1}`,
            name: item.name,
            category: item.category,
            startTime: item.startTime,
            endTime: item.endTime,
            cost: item.cost,
            image: item.image,
            location: item.location,
            notes: item.notes
          });
        });
      }

      days.push({
        dayNumber,
        date: dateStr,
        city: destinationStr.split(',')[0].trim(),
        activities: dayActivities
      });
    }

    return days;
  }

  _getDestinationArchetypes(destination) {
    const city = (destination || 'City').split(',')[0].trim();
    return [
      // Template Day 1: Orientation & Culinary
      [
        {
          name: `Arrival & Boutique Stay Check-in in ${city}`,
          category: 'stay',
          startTime: '14:00',
          endTime: '15:30',
          cost: 160,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
          location: `Downtown, ${city}`,
          notes: 'Unpack, refresh, and collect local map and transit passes.'
        },
        {
          name: `${city} Old Town Historic Walking Tour`,
          category: 'sightseeing',
          startTime: '16:30',
          endTime: '18:30',
          cost: 25,
          image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
          location: `Historic Square, ${city}`,
          notes: 'Explore medieval architecture, scenic cobblestone lanes, and city monuments.'
        },
        {
          name: `Traditional Gastronomy & Welcome Dinner in ${city}`,
          category: 'food',
          startTime: '19:30',
          endTime: '21:30',
          cost: 55,
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
          location: `City Center, ${city}`,
          notes: 'Sample local culinary specialties paired with regional wines and desserts.'
        }
      ],
      // Template Day 2: Major Landmark & Art Immersion
      [
        {
          name: `${city} Premier Museum & Heritage Landmark`,
          category: 'culture',
          startTime: '09:30',
          endTime: '12:30',
          cost: 40,
          image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
          location: `Museum Quarter, ${city}`,
          notes: 'Guided audio tour covering celebrated national art collections and artifacts.'
        },
        {
          name: `Artisan Food Hall & Local Delicacy Tasting`,
          category: 'food',
          startTime: '13:00',
          endTime: '14:30',
          cost: 30,
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
          location: `Central Market Hall, ${city}`,
          notes: 'Taste authentic local street food, farm cheeses, and fresh pastries.'
        },
        {
          name: `${city} Scenic River / Coast Panorama Cruise`,
          category: 'sightseeing',
          startTime: '16:00',
          endTime: '18:00',
          cost: 45,
          image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
          location: `Harbour Promenade, ${city}`,
          notes: 'Gliding past iconic illuminated bridges and waterfront skyline.'
        }
      ],
      // Template Day 3: Nature & Viewpoints
      [
        {
          name: `${city} Clifftop / Mountain Panorama Lookout`,
          category: 'adventure',
          startTime: '09:00',
          endTime: '12:30',
          cost: 35,
          image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
          location: `Observation Summit, ${city}`,
          notes: 'Cable car ascent with 360-degree photography vistas.'
        },
        {
          name: `Boutique Shopping Promenade & Cafés in ${city}`,
          category: 'shopping',
          startTime: '14:30',
          endTime: '17:30',
          cost: 65,
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
          location: `Fashion Boulevard, ${city}`,
          notes: 'Browse artisanal crafts, handmade souvenirs, and enjoy specialty coffee.'
        },
        {
          name: `Sunset Rooftop Lounge & Evening Celebration`,
          category: 'nightlife',
          startTime: '19:00',
          endTime: '21:30',
          cost: 60,
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
          location: `Skyline Terrace, ${city}`,
          notes: 'Signature cocktails and sunset views over the glowing city skyline.'
        }
      ]
    ];
  }

  _generateDaysBetween(startDateStr, endDateStr, cityName) {
    const days = [];
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.max(0, end - start);
    const numDays = Math.min(30, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

    for (let i = 0; i < numDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      days.push({
        dayNumber: i + 1,
        date: currentDate.toISOString().split('T')[0],
        city: (cityName || 'Destination').split(',')[0].trim(),
        activities: []
      });
    }
    return days;
  }

  _adjustDaysForDateRange(existingDays, newStartStr, newEndStr, cityName) {
    const newDays = this._generateDaysBetween(newStartStr, newEndStr, cityName);
    newDays.forEach((newDay, idx) => {
      if (existingDays && existingDays[idx]) {
        newDay.activities = existingDays[idx].activities;
        if (existingDays[idx].city) newDay.city = existingDays[idx].city;
      } else {
        // Auto-populate additional days if extended
        const archetypes = this._getDestinationArchetypes(cityName);
        const plan = archetypes[idx % archetypes.length];
        newDay.activities = plan.map((item, actIdx) => ({
          id: `ext-${newDay.dayNumber}-${actIdx + 1}`,
          name: item.name,
          category: item.category,
          startTime: item.startTime,
          endTime: item.endTime,
          cost: item.cost,
          image: item.image,
          location: item.location,
          notes: item.notes
        }));
      }
    });
    return newDays;
  }

  _matchDestinationCover(destStr) {
    const d = (destStr || '').toLowerCase();
    const found = CONFIG.DESTINATIONS.find(item => d.includes(item.name.toLowerCase()) || d.includes(item.country.toLowerCase()));
    if (found) return found.image;
    const cover = CONFIG.COVER_PRESETS.find(p => d.includes(p.id));
    if (cover) return cover.url;
    return CONFIG.COVER_PRESETS[0].url;
  }

  _extractCountry(destStr) {
    if (!destStr) return 'World';
    const parts = destStr.split(',');
    if (parts.length > 1) return parts[parts.length - 1].trim();
    return parts[0].trim();
  }

  _getCategoryDefaultImage(category) {
    const map = {
      sightseeing: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      culture: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
      adventure: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
      stay: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      shopping: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
      transport: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=600&q=80',
      nightlife: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80'
    };
    return map[category] || map.sightseeing;
  }

  async _transformBackendTrip(backendTrip) {
    let descObj = { desc: '', dest: 'Global', budget: 0, currency: 'USD' };
    try {
      if (backendTrip.description) descObj = JSON.parse(backendTrip.description);
    } catch (e) {}

    const days = this._generateAutoItinerary(descObj.dest, backendTrip.startDate, backendTrip.endDate, descObj.budget);

    return {
      id: backendTrip.id,
      title: backendTrip.name,
      description: descObj.desc,
      destination: descObj.dest,
      startDate: backendTrip.startDate,
      endDate: backendTrip.endDate,
      budget: Number(descObj.budget) || 0,
      currency: descObj.currency || 'USD',
      coverImage: backendTrip.coverPhoto || CONFIG.COVER_PRESETS[0].url,
      tags: ['Adventure', 'Culture'],
      days: days
    };
  }
}

window.MockApi = new ApiClient();
