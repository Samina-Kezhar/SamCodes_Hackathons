/**
 * Screen 6: Itinerary Reader View Screen
 * Visual representation of the trip itinerary with Day 1 in a box and Day 2 in another box.
 * Displays rich day-by-day breakdown with images, time, location, cost, and activity details.
 */

const ItineraryView = {
  viewMode: 'detailed', // 'detailed' | 'timeline' | 'compact' | 'cities'

  popularDestinations: [
    { name: 'Goa', flag: '🏖️' },
    { name: 'Dubai', flag: '🏙️' },
    { name: 'Tokyo', flag: '⛩️' },
    { name: 'Paris', flag: '🗼' },
    { name: 'Manali', flag: '🏔️' },
    { name: 'Jaipur', flag: '🏰' },
    { name: 'Kerala', flag: '🌴' },
    { name: 'Bali', flag: '🌺' },
    { name: 'Rome', flag: '🏛️' },
    { name: 'London', flag: '🎡' },
    { name: 'Singapore', flag: '🦁' },
    { name: 'New York City', flag: '🗽' }
  ],

  async render(tripId = null) {
    const container = document.getElementById('view-container');
    if (!container) return;

    const currentId = tripId || AppStore.currentTripId || (AppStore.trips && AppStore.trips.length > 0 ? AppStore.trips[0].id : null);
    
    // If no trip exists yet, show interactive destination chooser to generate one immediately
    if (!currentId) {
      container.innerHTML = `
        <div class="animate-fade-in" style="max-width: 900px; margin: 2rem auto; padding: 1rem;">
          <div class="glass-card text-center" style="padding: 2.5rem 1.5rem; margin-bottom: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">🗺️</div>
            <h2>Choose a Place for Your Itinerary</h2>
            <p style="margin-bottom: 1.5rem; max-width: 500px; margin-left: auto; margin-right: auto; color: var(--text-muted);">
              Select any destination below to immediately view all days planned in distinct boxes with timings, budget, and photos!
            </p>
            <div class="flex items-center gap-2" style="flex-wrap: wrap; justify-content: center; margin-bottom: 1.5rem;">
              ${this.popularDestinations.map(d => `
                <button type="button" class="filter-pill" onclick="ItineraryView.quickPlanForDestination('${d.name}')">
                  <span>${d.flag}</span>
                  <span>${d.name}</span>
                </button>
              `).join('')}
            </div>
            <button class="btn btn-primary" onclick="AppRouter.navigate('create-trip')">
              <span>➕</span> Custom Stay Duration & Dates Planner
            </button>
          </div>
        </div>
      `;
      return;
    }

    const response = await MockApi.getTripById(currentId);
    const trip = response.data;

    const duration = Utils.daysBetween(trip.startDate, trip.endDate);
    const totalSpent = trip.days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0), 0);

    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 980px; margin: 0 auto; padding-bottom: 3rem;">
        
        <!-- Quick Switch Destination Bar -->
        <div class="glass-card" style="margin-bottom: 1.25rem; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
          <div class="flex items-center gap-2" style="flex-wrap: wrap;">
            <span class="font-bold" style="font-size: 0.85rem; color: var(--text-muted);">Switch Place:</span>
            ${this.popularDestinations.slice(0, 8).map(p => `
              <button type="button" class="filter-pill ${trip.destination.toLowerCase().includes(p.name.toLowerCase()) ? 'active' : ''}" 
                onclick="ItineraryView.quickPlanForDestination('${p.name}')" style="padding: 4px 10px; font-size: 0.8rem;">
                <span>${p.flag}</span> <span>${p.name}</span>
              </button>
            `).join('')}
          </div>
          <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('create-trip')">
            <span>➕</span> Plan New Place
          </button>
        </div>

        <!-- Header Banner -->
        <div class="glass-card flex items-center justify-between" style="margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1.25rem; border-left: 4px solid var(--primary-500);">
          <div style="min-width: 0; flex: 1 1 320px;">
            <div class="flex items-center gap-2" style="margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span class="badge badge-primary">Itinerary Section (Boxed)</span>
              <span class="badge badge-cyan">${duration} Days Stay</span>
              <span class="badge badge-emerald">Budget: ${Utils.formatCurrency(trip.budget, trip.currency)}</span>
            </div>
            <h2 style="word-break: break-word; overflow-wrap: anywhere; line-height: 1.3;">${Utils.escapeHtml(trip.title)}</h2>
            <div class="flex items-center gap-4" style="margin-top: 0.45rem; font-size: 0.875rem; color: var(--text-muted); flex-wrap: wrap;">
              <span>📍 <strong>${Utils.escapeHtml(trip.destination)}</strong></span>
              <span>🗓️ ${Utils.formatDate(trip.startDate)} - ${Utils.formatDate(trip.endDate)}</span>
              <span>💰 Est. Spend: <strong style="color: var(--accent-emerald);">${Utils.formatCurrency(totalSpent, trip.currency)}</strong> of ${Utils.formatCurrency(trip.budget, trip.currency)}</span>
            </div>
          </div>

          <div class="flex items-center gap-2" style="flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('create-trip')" title="Customize Destination, Days or Dates">
              <span>⏱️</span> Edit Duration / Dates
            </button>
            <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('itinerary-builder', '${trip.id}')" title="Edit Activities & Times">
              <span>✏️</span> Activity Builder
            </button>
            <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('budget', '${trip.id}')" title="Cost Breakdown">
              <span>📊</span> Budget
            </button>
            <button class="btn btn-primary btn-sm" onclick="AppRouter.navigate('shared-trip', '${trip.id}')" title="Public Share">
              <span>🔗</span> Share
            </button>
          </div>
        </div>

        <!-- View Mode Switcher -->
        <div class="flex items-center justify-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div class="tab-list">
            <button class="tab-btn ${this.viewMode === 'detailed' ? 'active' : ''}" onclick="ItineraryView.switchMode('detailed', '${trip.id}')">
              <span>📦</span> Boxed Cards (Detailed)
            </button>
            <button class="tab-btn ${this.viewMode === 'timeline' ? 'active' : ''}" onclick="ItineraryView.switchMode('timeline', '${trip.id}')">
              <span>⏱️</span> Timeline Flow
            </button>
            <button class="tab-btn ${this.viewMode === 'compact' ? 'active' : ''}" onclick="ItineraryView.switchMode('compact', '${trip.id}')">
              <span>📑</span> Compact List
            </button>
            <button class="tab-btn ${this.viewMode === 'cities' ? 'active' : ''}" onclick="ItineraryView.switchMode('cities', '${trip.id}')">
              <span>🏙️</span> By Cities
            </button>
          </div>

          <div class="flex items-center gap-3">
            <span style="font-size: 0.85rem; color: var(--text-muted);">
              ${trip.days.length} Days &bull; ${trip.days.reduce((acc, d) => acc + d.activities.length, 0)} Curated Activities
            </span>
          </div>
        </div>

        <!-- Boxed Days Stream: Day-1 in Box 1, Day-2 in Box 2 -->
        ${this.viewMode === 'cities' ? this.renderGroupedByCities(trip) : `
        <div class="flex flex-col gap-6">
          ${trip.days.map((day, dayIndex) => {
            const dayCost = day.activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
            const borderColors = [
              'var(--primary-500)',
              'var(--accent-cyan)',
              'var(--accent-emerald)',
              'var(--accent-amber)',
              'var(--accent-rose)',
              '#a78bfa'
            ];
            const activeColor = borderColors[dayIndex % borderColors.length];

            return `
              <div class="itinerary-day-box day-card" style="border-left: 5px solid ${activeColor}; background: var(--surface-1); border-radius: var(--radius-md); border-top: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); overflow: hidden; margin-bottom: 2rem; box-shadow: var(--shadow-md);">
                <!-- Day Header Banner inside the box -->
                <div class="itinerary-day-box-header flex items-center justify-between" style="padding: 1.15rem 1.4rem; background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%); border-bottom: 1px solid var(--glass-border); flex-wrap: wrap; gap: 0.75rem;">
                  <div class="flex items-center gap-3">
                    <span class="day-number-badge" style="background: ${activeColor}; color: #fff; min-width: 3.5rem; text-align: center; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-xs); font-size: 0.9rem;">
                      Day ${day.dayNumber}
                    </span>
                    <div>
                      <h3 style="font-size: 1.15rem; margin-bottom: 2px;">
                        ${day.theme || Utils.formatDate(day.date)}
                      </h3>
                      <div class="flex items-center gap-3" style="font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
                        <span>🗓️ ${Utils.formatDate(day.date)}</span>
                        <span style="color: var(--accent-cyan);">📍 ${Utils.escapeHtml(day.city || trip.destination)}</span>
                        <span>&bull; ${day.activities.length} ${day.activities.length === 1 ? 'activity' : 'activities'}</span>
                      </div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.75rem; color: var(--text-subtle);">Daily Spend</div>
                    <span style="font-weight: 700; color: var(--accent-emerald); font-size: 1.05rem;">
                      ${Utils.formatCurrency(dayCost, trip.currency)}
                    </span>
                  </div>
                </div>

                <!-- Activities Content by View Mode inside the box -->
                ${day.activities.length === 0 ? `
                  <div style="text-align: center; padding: 2rem 1rem; color: var(--text-subtle); font-style: italic;">
                    Free exploration day — no scheduled bookings.
                  </div>
                ` : this.viewMode === 'timeline' ? `
                  <!-- Timeline Layout with Photos -->
                  <div style="position: relative; padding: 1.5rem 1.25rem 1.5rem 2.5rem; border-left: 2px solid var(--surface-3); margin-left: 1.5rem;">
                    ${day.activities.map(act => {
                      const cat = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                      const actImg = act.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80';

                      return `
                        <div style="position: relative; margin-bottom: 1.5rem;">
                          <div style="position: absolute; left: -2.35rem; top: 0.5rem; width: 16px; height: 16px; border-radius: 50%; background: ${cat.color}; border: 2px solid var(--bg-app); box-shadow: 0 0 8px ${cat.color}88;"></div>
                          
                          <div class="glass-card-subtle flex items-center justify-between" style="padding: 0.85rem 1.15rem; gap: 1rem; flex-wrap: wrap;">
                            <div class="flex items-center gap-3" style="min-width: 0; flex: 1 1 280px;">
                              <img src="${actImg}" alt="${act.name}" 
                                style="width: 60px; height: 50px; border-radius: 6px; object-fit: cover; flex-shrink: 0;"
                                onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'" />
                              <div style="min-width: 0;">
                                <div class="flex items-center gap-2">
                                  <span>${cat.icon}</span>
                                  <strong style="font-size: 0.95rem; word-break: break-word; overflow-wrap: anywhere;">${Utils.escapeHtml(act.name)}</strong>
                                </div>
                                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 3px; word-break: break-word;">
                                  ${act.cityName ? `🏙️ <span style="color: var(--accent-cyan);">${Utils.escapeHtml(act.cityName)}</span> &bull; ` : ''}
                                  ${act.location ? `📍 <span>${Utils.escapeHtml(act.location)}</span>` : ''}
                                </div>
                              </div>
                            </div>

                            <div style="text-align: right; flex-shrink: 0;">
                              <span class="activity-time-tag">${act.startTime} - ${act.endTime}</span>
                              <div style="font-size: 0.9rem; font-weight: 700; color: var(--accent-emerald); margin-top: 4px;">
                                ${Utils.formatCurrency(act.cost, trip.currency)}
                              </div>
                            </div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : this.viewMode === 'compact' ? `
                  <!-- Compact Table Layout -->
                  <div class="flex flex-col gap-2" style="padding: 1.15rem;">
                    ${day.activities.map(act => {
                      const cat = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                      return `
                        <div class="glass-card-subtle flex items-center justify-between" style="padding: 0.65rem 1rem; gap: 0.75rem;">
                          <div class="flex items-center gap-3" style="min-width: 0;">
                            <span class="activity-time-tag" style="padding: 2px 6px; flex-shrink: 0;">${act.startTime}</span>
                            <span style="flex-shrink: 0;">${cat.icon}</span>
                            <span style="font-size: 0.9rem; font-weight: 500; word-break: break-word; overflow-wrap: anywhere;">
                              ${Utils.escapeHtml(act.name)}
                            </span>
                            ${act.cityName ? `<span style="font-size: 0.75rem; color: var(--accent-cyan);">(${Utils.escapeHtml(act.cityName)})</span>` : ''}
                          </div>
                          <span style="font-size: 0.9rem; font-weight: 700; color: var(--accent-emerald); flex-shrink: 0;">
                            ${Utils.formatCurrency(act.cost, trip.currency)}
                          </span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : `
                  <!-- Detailed Cards Layout with HD Photos, Times & Locations -->
                  <div class="flex flex-col gap-3" style="padding: 1.15rem;">
                    ${day.activities.map(act => {
                      const cat = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                      const actImg = act.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';

                      return `
                        <div class="activity-item" style="padding: 0.85rem 1.15rem;">
                          <!-- Activity Photo Thumbnail with Category Badge -->
                          <div class="activity-thumb-wrapper">
                            <img src="${actImg}" alt="${Utils.escapeHtml(act.name)}" class="activity-thumb-img" 
                              onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'" />
                            <span class="activity-category-pill" title="${cat.name}">${cat.icon}</span>
                          </div>

                          <!-- Activity Body -->
                          <div class="activity-body">
                            <div class="activity-header-line">
                              <h4 class="activity-title">${Utils.escapeHtml(act.name)}</h4>
                            </div>

                            <div class="activity-meta-line">
                              ${act.cityName ? `<span class="activity-meta-item" style="color: var(--accent-cyan); font-weight: 600;">🏙️ ${Utils.escapeHtml(act.cityName)}</span>` : ''}
                              ${act.location ? `<span class="activity-meta-item">📍 ${Utils.escapeHtml(act.location)}</span>` : ''}
                              <span class="activity-meta-item" style="color: ${cat.color}; font-weight: 500;">${cat.name}</span>
                              ${act.duration ? `<span class="activity-meta-item">⏱️ ${act.duration}</span>` : ''}
                            </div>

                            ${(act.description || act.notes) ? `
                              <p class="activity-description">${Utils.escapeHtml(act.description || act.notes)}</p>
                            ` : ''}
                          </div>

                          <!-- Time Slot & Cost Column -->
                          <div class="activity-timing-col">
                            <div class="activity-time-tag">${act.startTime || '--:--'} - ${act.endTime || '--:--'}</div>
                            <div class="activity-cost-tag">${Utils.formatCurrency(act.cost, trip.currency)}</div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                `}
              </div>
            `;
          }).join('')}
        </div>
        `}
      </div>
    `;
  },

  async quickPlanForDestination(destName) {
    Utils.showToast(`Synthesizing itinerary for ${destName}...`, 'info');
    const currency = (destName === 'Goa' || destName === 'Manali' || destName === 'Jaipur' || destName === 'Kerala') ? 'INR' : (destName === 'Tokyo' ? 'JPY' : 'USD');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const end = new Date(tomorrow);
    end.setDate(tomorrow.getDate() + 4);

    const startStr = tomorrow.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    const res = await MockApi.createTrip({
      title: `5-Day Journey in ${destName}`,
      destination: destName,
      startDate: startStr,
      endDate: endStr,
      currency: currency,
      autoGenerate: true
    });

    Utils.showToast(`Itinerary for ${destName} generated!`, 'success');
    this.render(res.data.id);
  },

  renderGroupedByCities(trip) {
    const stops = trip.stops && trip.stops.length > 0 
      ? trip.stops 
      : [{ id: 'stop-1', cityName: trip.destination, country: 'World', arrivalDate: trip.startDate, departureDate: trip.endDate }];

    const cityGroups = stops.map(stop => {
      const activities = [];
      trip.days.forEach(day => {
        day.activities.forEach(act => {
          if (act.cityName === stop.cityName || (!act.cityName && (day.city === stop.cityName || stops.length === 1))) {
            activities.push({ ...act, dayNumber: day.dayNumber, date: day.date });
          }
        });
      });
      const totalCost = activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
      return { stop, activities, totalCost };
    });

    return `
      <div class="flex flex-col gap-6">
        ${cityGroups.map((group, idx) => `
          <div class="glass-card" style="padding: 1.5rem; border-left: 4px solid var(--accent-cyan); border-radius: var(--radius-md);">
            <!-- City Stop Header -->
            <div class="flex items-center justify-between" style="margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--glass-border); flex-wrap: wrap; gap: 0.75rem;">
              <div class="flex items-center gap-3">
                <span class="day-number-badge" style="background: var(--grad-cyan); min-width: 4rem;">Stop #${idx + 1}</span>
                <div>
                  <h3 style="font-size: 1.25rem; margin-bottom: 2px;">
                    🏙️ ${Utils.escapeHtml(group.stop.cityName)}, ${Utils.escapeHtml(group.stop.country || '')}
                  </h3>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">
                    🗓️ ${Utils.formatDate(group.stop.arrivalDate)} - ${Utils.formatDate(group.stop.departureDate)} &bull; ${group.activities.length} total activities
                  </div>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.75rem; color: var(--text-subtle);">Total City Spend</div>
                <span style="font-weight: 700; color: var(--accent-emerald); font-size: 1.1rem;">
                  ${Utils.formatCurrency(group.totalCost, trip.currency)}
                </span>
              </div>
            </div>

            <!-- Activities in this City -->
            ${group.activities.length === 0 ? `
              <div style="text-align: center; padding: 2rem 1rem; color: var(--text-subtle); font-style: italic;">
                No scheduled activities in ${Utils.escapeHtml(group.stop.cityName)} yet.
              </div>
            ` : `
              <div class="flex flex-col gap-3">
                ${group.activities.map(act => {
                  const cat = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                  const actImg = act.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80';
                  return `
                    <div class="activity-item" style="padding: 0.85rem 1rem;">
                      <div class="activity-thumb-wrapper" style="width: 54px; height: 54px; min-width: 54px;">
                        <img src="${actImg}" alt="${act.name}" class="activity-thumb-img" 
                          onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'" />
                        <span class="activity-category-pill" style="font-size: 0.75rem;">${cat.icon}</span>
                      </div>
                      <div class="activity-body">
                        <div class="flex items-center gap-2">
                          <span class="badge badge-primary" style="font-size: 0.65rem;">Day ${act.dayNumber}</span>
                          <strong style="font-size: 0.95rem;">${Utils.escapeHtml(act.name)}</strong>
                        </div>
                        <div class="activity-meta-line" style="margin-top: 2px;">
                          ${act.location ? `<span class="activity-meta-item">📍 ${Utils.escapeHtml(act.location)}</span>` : ''}
                          <span class="activity-meta-item" style="color: ${cat.color}; font-weight: 500;">${cat.name}</span>
                          ${act.duration ? `<span class="activity-meta-item">⏱️ ${act.duration}</span>` : ''}
                        </div>
                      </div>
                      <div class="activity-timing-col">
                        <div class="activity-time-tag">${act.startTime} - ${act.endTime}</div>
                        <div class="activity-cost-tag">${Utils.formatCurrency(act.cost, trip.currency)}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        `).join('')}
      </div>
    `;
  },

  switchMode(mode, tripId) {
    this.viewMode = mode;
    this.render(tripId);
  }
};
