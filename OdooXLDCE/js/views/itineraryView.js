/**
 * Screen 6: Itinerary View Screen (Reader & Review Mode)
 * Visual representation of the completed trip itinerary in multiple view modes (Detailed, Timeline, Compact).
 * Highlights day-by-day breakdown with images, times, locations, and activities.
 */

const ItineraryView = {
  viewMode: 'detailed', // 'detailed' | 'timeline' | 'compact'

  async render(tripId = null) {
    const container = document.getElementById('view-container');
    if (!container) return;

    const currentId = tripId || AppStore.currentTripId;
    if (!currentId) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🗺️</div>
          <h3>No trip selected</h3>
          <p>Please select or create a trip to review its itinerary.</p>
          <button class="btn btn-primary" onclick="AppRouter.navigate('create-trip')">Plan New Trip</button>
        </div>
      `;
      return;
    }

    try {
      const response = await MockApi.getTripById(currentId);
      const trip = response.data;
      AppStore.setCurrentTripId(trip.id);

      const duration = Utils.daysBetween(trip.startDate, trip.endDate);
      const totalSpent = trip.days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0), 0);
      const totalActivities = trip.days.reduce((acc, d) => acc + d.activities.length, 0);

      container.innerHTML = `
        <div class="animate-fade-in" style="max-width: 1020px; margin: 0 auto;">
          <!-- Top Header Banner -->
          <div class="glass-card flex items-center justify-between" style="margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1.25rem; border-left: 4px solid var(--primary-500);">
            <div style="flex: 1; min-width: 280px;">
              <div class="flex items-center gap-2" style="margin-bottom: 0.35rem; flex-wrap: wrap;">
                <span class="badge badge-primary">Day-by-Day Itinerary</span>
                <span class="badge badge-emerald">✨ Auto-Generated & Ready</span>
                <span class="badge badge-cyan">${duration} Days</span>
              </div>
              <h1 style="font-size: 1.85rem; margin-bottom: 0.35rem;">${Utils.escapeHtml(trip.title)}</h1>
              <div class="flex items-center gap-4" style="margin-top: 0.35rem; font-size: 0.875rem; color: var(--text-muted); flex-wrap: wrap;">
                <span>📍 <strong>${Utils.escapeHtml(trip.destination)}</strong></span>
                <span>🗓️ ${Utils.formatDate(trip.startDate)} - ${Utils.formatDate(trip.endDate)}</span>
                <span>🎯 ${totalActivities} Activities</span>
                <span>💰 Est. <strong>${Utils.formatCurrency(totalSpent, trip.currency)}</strong></span>
              </div>
            </div>

            <div class="flex items-center gap-2" style="flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" onclick="AppRouter.navigate('itinerary-builder', '${trip.id}')" title="Edit & Reorder Activities">
                <span>✏️</span> Edit Builder
              </button>
              <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('budget', '${trip.id}')" title="Cost Breakdown">
                <span>📊</span> Budget
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.print()" title="Print Itinerary">
                <span>🖨️</span> Print / PDF
              </button>
              <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('shared-trip', '${trip.id}')" title="Share with others">
                <span>🔗</span> Share
              </button>
            </div>
          </div>

          <!-- View Mode Switcher -->
          <div class="flex items-center justify-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div class="tab-list">
              <button class="tab-btn ${this.viewMode === 'detailed' ? 'active' : ''}" onclick="ItineraryView.switchMode('detailed', '${trip.id}')">
                <span>📋</span> Detailed Cards
              </button>
              <button class="tab-btn ${this.viewMode === 'timeline' ? 'active' : ''}" onclick="ItineraryView.switchMode('timeline', '${trip.id}')">
                <span>⏱️</span> Timeline Flow
              </button>
              <button class="tab-btn ${this.viewMode === 'compact' ? 'active' : ''}" onclick="ItineraryView.switchMode('compact', '${trip.id}')">
                <span>📑</span> Compact List
              </button>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-muted);">
              Displaying ${trip.days.length} Days &bull; ${totalActivities} Scheduled Items
            </div>
          </div>

          <!-- Days Content (Day-by-Day Breakdown) -->
          <div class="flex flex-col gap-6">
            ${trip.days.map((day, dayIndex) => {
              const dayCost = day.activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
              const dayColors = ['var(--primary-500)', 'var(--accent-cyan)', 'var(--accent-emerald)', 'var(--accent-amber)', 'var(--accent-rose)', '#a78bfa', '#34d399', '#f472b6'];
              const accentColor = dayColors[dayIndex % dayColors.length];

              return `
                <div class="glass-card" style="padding: 1.5rem; border-left: 4px solid ${accentColor};">
                  <!-- Day Header -->
                  <div class="day-card-header" style="margin: -1.5rem -1.5rem 1.25rem -1.5rem; padding: 1rem 1.5rem; background: var(--surface-2); border-bottom: 1px solid var(--glass-border);">
                    <div class="flex items-center gap-3">
                      <span class="day-number-badge" style="background: ${accentColor};">Day ${day.dayNumber}</span>
                      <div>
                        <h3 style="margin-bottom: 2px; font-size: 1.15rem;">${Utils.formatDate(day.date)}</h3>
                        <span style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 500;">📍 ${Utils.escapeHtml(day.city || trip.destination)}</span>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="badge badge-emerald" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">
                        ${Utils.formatCurrency(dayCost, trip.currency)}
                      </span>
                    </div>
                  </div>

                  <!-- Activities Content by View Mode -->
                  ${day.activities.length === 0 ? `
                    <div style="text-align: center; padding: 2rem 1rem; color: var(--text-subtle); font-size: 0.875rem;">
                      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌴</div>
                      Free exploration day — no scheduled activities booked.<br/>
                      <button class="btn btn-secondary btn-sm" style="margin-top: 0.75rem;" onclick="AppRouter.navigate('itinerary-builder', '${trip.id}')">
                        + Add Activities in Builder
                      </button>
                    </div>
                  ` : this.viewMode === 'timeline' ? `
                    <!-- Timeline Mode -->
                    <div class="timeline-track">
                      ${day.activities.map(act => {
                        const cat = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                        const actImg = act.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80';

                        return `
                          <div style="position: relative; margin-bottom: 1.5rem;">
                            <div class="timeline-dot" style="background: ${cat.color};"></div>
                            <div class="glass-card-subtle flex items-center justify-between" style="padding: 1rem 1.25rem; gap: 1rem; flex-wrap: wrap;">
                              <div class="flex items-center gap-3" style="flex: 1; min-width: 240px;">
                                <img src="${actImg}" alt="${Utils.escapeHtml(act.name)}" class="activity-thumb" />
                                <div style="min-width: 0; flex: 1;">
                                  <div class="flex items-center gap-2" style="margin-bottom: 4px;">
                                    <span style="font-size: 1.1rem;">${cat.icon}</span>
                                    <strong class="activity-name">${Utils.escapeHtml(act.name)}</strong>
                                    <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 0.7rem;">${cat.name}</span>
                                  </div>
                                  <div class="activity-meta">
                                    ${act.location ? `<span style="color: var(--accent-cyan);">📍 ${Utils.escapeHtml(act.location)}</span>` : ''}
                                    ${act.notes ? `<span style="color: var(--text-muted);">&bull; ${Utils.escapeHtml(act.notes)}</span>` : ''}
                                  </div>
                                </div>
                              </div>

                              <div style="text-align: right; flex-shrink: 0;">
                                <span class="activity-time-tag">⏱️ ${act.startTime} - ${act.endTime}</span>
                                <div class="activity-cost-tag" style="margin-top: 4px;">
                                  ${act.cost > 0 ? Utils.formatCurrency(act.cost, trip.currency) : 'Free Admission'}
                                </div>
                              </div>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  ` : this.viewMode === 'compact' ? `
                    <!-- Compact Mode -->
                    <div class="flex flex-col gap-2">
                      ${day.activities.map(act => {
                        const cat = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                        const actImg = act.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80';

                        return `
                          <div class="glass-card-subtle flex items-center justify-between" style="padding: 0.6rem 1rem; gap: 0.75rem; flex-wrap: wrap;">
                            <div class="flex items-center gap-3" style="flex: 1; min-width: 200px;">
                              <img src="${actImg}" alt="${Utils.escapeHtml(act.name)}" style="width: 40px; height: 40px; border-radius: var(--radius-xs); object-fit: cover; flex-shrink: 0;" />
                              <span class="activity-time-tag">${act.startTime}</span>
                              <span style="font-size: 1.1rem;">${cat.icon}</span>
                              <div style="min-width: 0;">
                                <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                  ${Utils.escapeHtml(act.name)}
                                </div>
                                <div style="font-size: 0.75rem; color: var(--text-subtle);">📍 ${Utils.escapeHtml(act.location || day.city)}</div>
                              </div>
                            </div>

                            <span class="activity-cost-tag">
                              ${act.cost > 0 ? Utils.formatCurrency(act.cost, trip.currency) : 'Free'}
                            </span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  ` : `
                    <!-- Detailed Cards Mode (Default - Rich Experience) -->
                    <div class="flex flex-col gap-3">
                      ${day.activities.map(act => {
                        const cat = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                        const actImg = act.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80';

                        return `
                          <div class="activity-item" style="padding: 1rem 1.25rem;">
                            <!-- Activity Image Thumbnail -->
                            <img src="${actImg}" alt="${Utils.escapeHtml(act.name)}" class="activity-thumb" />

                            <!-- Activity Details -->
                            <div class="activity-info">
                              <div class="flex items-center gap-2" style="margin-bottom: 4px; flex-wrap: wrap;">
                                <span style="font-size: 1.15rem;">${cat.icon}</span>
                                <h4 class="activity-name" style="margin-bottom: 0;">${Utils.escapeHtml(act.name)}</h4>
                                <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 0.72rem; color: var(--text-muted);">${cat.name}</span>
                              </div>

                              <div class="activity-meta" style="margin-top: 4px;">
                                ${act.location ? `<span style="color: var(--accent-cyan); font-weight: 500;">📍 ${Utils.escapeHtml(act.location)}</span>` : ''}
                                ${act.notes ? `<span>📝 ${Utils.escapeHtml(act.notes)}</span>` : ''}
                              </div>
                            </div>

                            <!-- Activity Time & Cost Tags -->
                            <div style="text-align: right; flex-shrink: 0; min-width: 110px;">
                              <div class="activity-time-tag">⏱️ ${act.startTime} - ${act.endTime}</div>
                              <div class="activity-cost-tag" style="margin-top: 6px;">
                                ${act.cost > 0 ? Utils.formatCurrency(act.cost, trip.currency) : 'Free Admission'}
                              </div>
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
        </div>
      `;

    } catch (err) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Failed to load Itinerary</h3>
          <p>${Utils.escapeHtml(err.message || 'Error loading itinerary.')}</p>
          <button class="btn btn-primary" onclick="AppRouter.navigate('my-trips')">Back to Trips</button>
        </div>
      `;
    }
  },

  switchMode(mode, tripId) {
    this.viewMode = mode;
    this.render(tripId);
  }
};
