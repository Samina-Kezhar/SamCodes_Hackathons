/**
 * Screens 5 & 6: Itinerary Builder View
 * Day-wise layout, multi-city stop management, activity creator, drag-to-reorder,
 * overlapping activity conflict detection, and date adjustment edge cases.
 */

const ItineraryBuilderView = {
  activeDayNumber: 1,

  async render(tripId = null) {
    const container = document.getElementById('view-container');
    if (!container) return;

    const currentId = tripId || AppStore.currentTripId || (AppStore.trips && AppStore.trips.length > 0 ? AppStore.trips[0].id : null);
    if (!currentId) {
      container.innerHTML = `<div class="empty-state"><h3>No trip selected</h3><button class="btn btn-primary" onclick="AppRouter.navigate('create-trip')">Create Trip</button></div>`;
      return;
    }

    try {
      const response = await MockApi.getTripById(currentId);
      const trip = response.data;
      AppStore.setCurrentTripId(trip.id);

      const totalSpent = trip.days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0), 0);
      const duration = Utils.daysBetween(trip.startDate, trip.endDate);

      // Check total trip conflicts
      let globalConflictCount = 0;
      trip.days.forEach(d => {
        const conflictInfo = Utils.detectActivityConflicts(d.activities);
        if (conflictInfo.hasConflict) globalConflictCount += conflictInfo.conflictPairs.length;
      });

      container.innerHTML = `
        <div class="animate-fade-in">
          <!-- Top Trip Header & View Switcher -->
          <div class="glass-card flex items-center justify-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; border-left: 4px solid var(--primary-500);">
            <div>
              <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
                <span class="badge badge-primary">Itinerary Builder</span>
                <span class="badge badge-cyan">${duration} Days</span>
                <span style="font-size: 0.825rem; color: var(--text-subtle);">🗓️ ${Utils.formatDate(trip.startDate)} - ${Utils.formatDate(trip.endDate)}</span>
              </div>
              <h2 style="margin-bottom: 0.25rem;">${Utils.escapeHtml(trip.title)}</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted);">
                📍 ${Utils.escapeHtml(trip.destination)} &bull; Budget: <strong>${Utils.formatCurrency(totalSpent, trip.currency)}</strong> of ${Utils.formatCurrency(trip.budget, trip.currency)}
              </p>
            </div>

            <div class="flex items-center gap-2" style="flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" onclick="ItineraryBuilderView.openEditDatesModal('${trip.id}')" title="Adjust Travel Dates">
                <span>🗓️</span> Change Dates
              </button>
              <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('itinerary-view', '${trip.id}')" title="Clean Reader View">
                <span>👁️</span> Reader View
              </button>
              <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('budget', '${trip.id}')" title="Financial Breakdown">
                <span>📊</span> Budget
              </button>
              <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('calendar', '${trip.id}')" title="Calendar Grid">
                <span>📅</span> Calendar
              </button>
              <button class="btn btn-primary btn-sm" onclick="AppRouter.navigate('shared-trip', '${trip.id}')" title="Share with friends">
                <span>🔗</span> Share
              </button>
            </div>
          </div>

          <!-- Global Overlap Conflict Alert Banner if any detected -->
          ${globalConflictCount > 0 ? `
            <div class="alert-banner alert-warning">
              <span style="font-size: 1.25rem;">⚠️</span>
              <div style="flex: 1;">
                <strong>Schedule Overlap Detected:</strong> There ${globalConflictCount === 1 ? 'is 1 overlapping activity' : `are ${globalConflictCount} overlapping activities`} in this itinerary. Check highlighted day cards below to adjust start/end times.
              </div>
            </div>
          ` : ''}

          <!-- Builder Layout: Days Stream + Sidebar Quick Add -->
          <div class="itinerary-container">
            <!-- Left: Days & Activities List -->
            <div class="itinerary-days-list">
              ${trip.days.map((day, dayIndex) => {
                const conflictData = Utils.detectActivityConflicts(day.activities);
                const daySpent = day.activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
                const dayColors = ['var(--primary-500)', 'var(--accent-cyan)', 'var(--accent-emerald)', 'var(--accent-amber)', 'var(--accent-rose)', '#a78bfa', '#34d399', '#f472b6'];
                const borderColor = dayColors[dayIndex % dayColors.length];

                return `
                  <div class="itinerary-day-box day-card ${conflictData.hasConflict ? 'has-conflict' : ''}" id="day-card-${day.dayNumber}"
                    style="border-left: 5px solid ${borderColor}; margin-bottom: 2rem;">
                    <div class="day-card-header itinerary-day-box-header" style="background: linear-gradient(90deg, rgba(0,0,0,0.25) 0%, transparent 100%); padding: 1.15rem 1.4rem;">
                      <div class="flex items-center gap-3">
                        <div class="day-number-badge" style="background: ${borderColor}; color: #fff; min-width: 2.5rem; text-align: center;">Day ${day.dayNumber}</div>
                        <div>
                          <div class="font-bold" style="font-size: 0.95rem;">${Utils.formatDate(day.date)}</div>
                          <div style="font-size: 0.78rem; color: var(--accent-cyan);">📍 ${Utils.escapeHtml(day.city || trip.destination)}</div>
                        </div>
                      </div>

                      <div class="flex items-center gap-3">
                        <span style="font-size: 0.85rem; font-weight: 600; color: var(--accent-emerald);">
                          ${Utils.formatCurrency(daySpent, trip.currency)}
                        </span>
                        <button class="btn btn-primary btn-sm" onclick="ItineraryBuilderView.openAddActivityModal('${trip.id}', ${day.dayNumber})">
                          <span>➕</span> Add Activity
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('search', { tripId: '${trip.id}', dayNumber: ${day.dayNumber} })" title="Search Catalog">
                          <span>🔍</span>
                        </button>
                      </div>
                    </div>

                    <!-- Overlap Warning for this specific day -->
                    ${conflictData.hasConflict ? `
                      <div style="padding: 0.6rem 1rem; background: rgba(245, 158, 11, 0.12); border-bottom: 1px solid rgba(245, 158, 11, 0.25); font-size: 0.8rem; color: #fde68a; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⚠️</span>
                        <span><strong>Time Conflict:</strong> ${conflictData.conflictPairs.map(p => `"${p.activityA}" overlaps with "${p.activityB}"`).join('; ')}</span>
                      </div>
                    ` : ''}

                    <!-- Day Activities -->
                    <div class="day-activities-list" id="day-act-list-${day.dayNumber}" style="padding: 0.5rem 0;">
                      ${day.activities.length === 0 ? `
                        <div style="text-align: center; padding: 2rem 1.5rem; color: var(--text-subtle); font-size: 0.875rem;">
                          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🗓️</div>
                          No activities scheduled for Day ${day.dayNumber} yet.<br/>Click <strong>"+ Add Activity"</strong> to get started.
                        </div>
                      ` : day.activities.map((act, index) => {
                        const isConflicted = conflictData.conflictingIds.has(act.id);
                        const categoryMeta = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];

                        const actImg = act.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80';

                        return `
                          <div class="activity-item ${isConflicted ? 'conflict-overlap' : ''}" id="act-item-${act.id}" data-act-id="${act.id}">
                            <div class="activity-drag-handle" title="Reorder Activity">⋮⋮</div>
                            
                            <!-- Thumbnail Photo with Category Badge -->
                            <div class="activity-thumb-wrapper">
                              <img src="${actImg}" alt="${act.name}" class="activity-thumb-img" 
                                onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'" />
                              <span class="activity-category-pill" title="${categoryMeta.name}">${categoryMeta.icon}</span>
                            </div>

                            <!-- Activity Body -->
                            <div class="activity-body">
                              <div class="activity-header-line">
                                <span class="activity-title">${Utils.escapeHtml(act.name)}</span>
                                ${isConflicted ? `<span class="badge badge-amber" style="font-size: 0.65rem;">Overlap Conflict</span>` : ''}
                              </div>
                              <div class="activity-meta-line">
                                ${act.cityName ? `<span class="activity-meta-item" style="color: var(--accent-cyan); font-weight: 600;">🏙️ ${Utils.escapeHtml(act.cityName)}</span>` : ''}
                                ${act.location ? `<span class="activity-meta-item">📍 ${Utils.escapeHtml(act.location)}</span>` : ''}
                                <span class="activity-meta-item" style="color: ${categoryMeta.color}; font-weight: 500;">${categoryMeta.name}</span>
                                ${act.duration ? `<span class="activity-meta-item">⏱️ ${act.duration}</span>` : ''}
                              </div>
                              ${(act.notes || act.description) ? `
                                <p class="activity-description">${Utils.escapeHtml(act.notes || act.description)}</p>
                              ` : ''}
                            </div>

                            <!-- Timing & Cost -->
                            <div class="activity-timing-col">
                              <div class="activity-time-tag">${act.startTime || '--:--'} - ${act.endTime || '--:--'}</div>
                              <div class="activity-cost-tag">${Utils.formatCurrency(act.cost || 0, trip.currency)}</div>
                            </div>

                            <!-- Action Controls -->
                            <div class="activity-actions">
                              ${index > 0 ? `
                                <button class="btn btn-ghost btn-sm" onclick="ItineraryBuilderView.moveActivity('${trip.id}', ${day.dayNumber}, ${index}, -1)" title="Move earlier">▲</button>
                              ` : ''}
                              ${index < day.activities.length - 1 ? `
                                <button class="btn btn-ghost btn-sm" onclick="ItineraryBuilderView.moveActivity('${trip.id}', ${day.dayNumber}, ${index}, 1)" title="Move later">▼</button>
                              ` : ''}
                              <button class="btn btn-ghost btn-sm" onclick="ItineraryBuilderView.openEditActivityModal('${trip.id}', ${day.dayNumber}, '${act.id}')" title="Edit Activity">✏️</button>
                              <button class="btn btn-ghost btn-sm" style="color: var(--accent-rose);" onclick="ItineraryBuilderView.deleteActivity('${trip.id}', ${day.dayNumber}, '${act.id}')" title="Delete Activity">🗑️</button>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `;
              }).join('')}

            </div>

            <!-- Right Sidebar: Trip Controls & Quick Add -->
            <div>
              <div class="glass-card" style="position: sticky; top: calc(var(--topbar-height) + 1.5rem);">
                <h4 style="margin-bottom: 1rem;">⚡ Quick Actions</h4>
                
                <div class="flex flex-col gap-2" style="margin-bottom: 1.5rem;">
                  <button class="btn btn-primary w-full" onclick="AppRouter.navigate('search', { tripId: '${trip.id}' })">
                    <span>🔍</span> Browse City Activities
                  </button>
                  <button class="btn btn-secondary w-full" onclick="ItineraryBuilderView.openAddStopModal('${trip.id}')">
                    <span>📍</span> Add Destination Stop
                  </button>
                </div>

                <div class="flex items-center justify-between" style="margin-bottom: 0.75rem;">
                  <h5 style="font-size: 0.85rem; color: var(--text-subtle); text-transform: uppercase; margin-bottom: 0;">Multi-City Stops & Sequence</h5>
                  <span class="badge badge-cyan" style="font-size: 0.7rem;">${trip.stops?.length || 1} Stop${(trip.stops?.length || 1) === 1 ? '' : 's'}</span>
                </div>
                <div class="flex flex-col gap-2" style="margin-bottom: 1.5rem;">
                  ${trip.stops && trip.stops.length > 0 ? trip.stops.map((s, stopIdx) => {
                    const actsInStop = trip.days.reduce((count, d) => count + d.activities.filter(a => a.cityName === s.cityName || (!a.cityName && d.city === s.cityName)).length, 0);
                    return `
                      <div class="glass-card-subtle flex items-center justify-between" style="padding: 0.65rem 0.85rem; border-left: 3px solid var(--accent-cyan);">
                        <div style="min-width: 0; flex: 1;">
                          <div class="flex items-center gap-2">
                            <span class="day-number-badge" style="background: var(--surface-3); font-size: 0.7rem; min-width: 1.6rem; height: 1.6rem; line-height: 1.6rem; padding: 0;">#${stopIdx + 1}</span>
                            <span class="font-bold" style="font-size: 0.9rem;">${Utils.escapeHtml(s.cityName)}</span>
                            <span class="badge badge-cyan" style="font-size: 0.65rem;">${Utils.escapeHtml(s.country || 'Global')}</span>
                          </div>
                          <div style="font-size: 0.75rem; color: var(--text-subtle); margin-top: 2px;">
                            🗓️ ${Utils.formatDateShort(s.arrivalDate)} - ${Utils.formatDateShort(s.departureDate)} &bull; ${actsInStop} activit${actsInStop === 1 ? 'y' : 'ies'}
                          </div>
                        </div>

                        <!-- Stop Reorder & Delete Controls -->
                        <div class="flex items-center gap-1" style="flex-shrink: 0; margin-left: 0.5rem;">
                          ${stopIdx > 0 ? `
                            <button class="btn btn-ghost btn-sm" style="padding: 3px 6px; font-size: 0.75rem;" onclick="ItineraryBuilderView.moveStop('${trip.id}', ${stopIdx}, -1)" title="Move stop up">▲</button>
                          ` : ''}
                          ${stopIdx < trip.stops.length - 1 ? `
                            <button class="btn btn-ghost btn-sm" style="padding: 3px 6px; font-size: 0.75rem;" onclick="ItineraryBuilderView.moveStop('${trip.id}', ${stopIdx}, 1)" title="Move stop down">▼</button>
                          ` : ''}
                          ${trip.stops.length > 1 ? `
                            <button class="btn btn-ghost btn-sm" style="padding: 3px 6px; color: var(--accent-rose); font-size: 0.75rem;" onclick="ItineraryBuilderView.deleteStop('${trip.id}', '${s.id || stopIdx}')" title="Delete stop">🗑️</button>
                          ` : ''}
                        </div>
                      </div>
                    `;
                  }).join('') : `
                    <div style="font-size: 0.8rem; color: var(--text-subtle);">No secondary stops configured.</div>
                  `}
                </div>

                <div style="border-top: 1px solid var(--glass-border); padding-top: 1rem;">
                  <div class="flex items-center justify-between" style="font-size: 0.85rem; margin-bottom: 0.5rem;">
                    <span style="color: var(--text-muted);">Total Planned Days:</span>
                    <span class="font-bold">${duration} Days</span>
                  </div>
                  <div class="flex items-center justify-between" style="font-size: 0.85rem;">
                    <span style="color: var(--text-muted);">Est. Expenses:</span>
                    <span class="font-bold" style="color: var(--accent-emerald);">${Utils.formatCurrency(totalSpent, trip.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

    } catch (err) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Failed to load Itinerary Builder</h3>
          <p>${Utils.escapeHtml(err.message)}</p>
          <button class="btn btn-primary" onclick="AppRouter.navigate('my-trips')">Back to Trips</button>
        </div>
      `;
    }
  },

  openAddActivityModal(tripId, dayNumber) {
    const modalHtml = `
      <div class="modal-header">
        <div class="modal-title">➕ Add Activity to Day ${dayNumber}</div>
        <button class="modal-close" onclick="AppRouter.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="form-add-activity" onsubmit="ItineraryBuilderView.handleAddActivitySubmit(event, '${tripId}', ${dayNumber})">
          <div class="form-group">
            <label class="form-label">Activity Name <span class="required">*</span></label>
            <input type="text" id="act-name" class="form-control" placeholder="e.g. Louvre Guided Tour & Mona Lisa" required />
          </div>

          <!-- Stop / City Association -->
          <div class="form-group">
            <label class="form-label">Destination Stop / City</label>
            <select id="act-stop" class="form-control">
              ${trip.stops && trip.stops.length > 0 ? trip.stops.map(s => `
                <option value="${Utils.escapeHtml(s.cityName)}">📍 ${Utils.escapeHtml(s.cityName)} (${Utils.escapeHtml(s.country || '')})</option>
              `).join('') : `
                <option value="${Utils.escapeHtml(trip.destination)}">📍 ${Utils.escapeHtml(trip.destination)}</option>
              `}
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="act-category" class="form-control">
                ${CONFIG.CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Estimated Cost</label>
              <input type="number" id="act-cost" class="form-control" placeholder="45" min="0" value="0" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Time <span class="required">*</span></label>
              <input type="time" id="act-start-time" class="form-control" required value="10:00" />
            </div>
            <div class="form-group">
              <label class="form-label">End Time <span class="required">*</span></label>
              <input type="time" id="act-end-time" class="form-control" required value="12:00" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Location / Address</label>
            <input type="text" id="act-location" class="form-control" placeholder="e.g. Rue de Rivoli, 75001 Paris" />
          </div>

          <div class="form-group">
            <label class="form-label">Notes & Booking Confirmation</label>
            <textarea id="act-notes" class="form-control" placeholder="e.g. Voucher QR saved, entrance at Pyramid gate"></textarea>
          </div>

          <div class="modal-footer" style="padding-left: 0; padding-right: 0; margin-bottom: -0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AppRouter.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save to Itinerary</button>
          </div>
        </form>
      </div>
    `;
    AppRouter.openModal(modalHtml);
  },

  async handleAddActivitySubmit(event, tripId, dayNumber) {
    event.preventDefault();
    const name = document.getElementById('act-name').value.trim();
    const cityName = document.getElementById('act-stop')?.value || '';
    const category = document.getElementById('act-category').value;
    const cost = document.getElementById('act-cost').value;
    const startTime = document.getElementById('act-start-time').value;
    const endTime = document.getElementById('act-end-time').value;
    const location = document.getElementById('act-location').value.trim();
    const notes = document.getElementById('act-notes').value.trim();

    if (startTime >= endTime) {
      Utils.showToast('Activity End Time must be after Start Time.', 'error');
      return;
    }

    try {
      await MockApi.addActivity(tripId, dayNumber, { name, cityName, category, cost, startTime, endTime, location, notes });
      AppRouter.closeModal();
      Utils.showToast(`Activity "${name}" added to Day ${dayNumber}!`, 'success');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to add activity.', 'error');
    }
  },

  openEditActivityModal(tripId, dayNumber, activityId) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    const day = trip?.days.find(d => d.dayNumber === dayNumber);
    const act = day?.activities.find(a => a.id === activityId);
    if (!act) return;

    const modalHtml = `
      <div class="modal-header">
        <div class="modal-title">✏️ Edit Activity</div>
        <button class="modal-close" onclick="AppRouter.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="form-edit-activity" onsubmit="ItineraryBuilderView.handleEditActivitySubmit(event, '${tripId}', ${dayNumber}, '${activityId}')">
          <div class="form-group">
            <label class="form-label">Activity Name <span class="required">*</span></label>
            <input type="text" id="edit-act-name" class="form-control" required value="${Utils.escapeHtml(act.name)}" />
          </div>

          <!-- Stop / City Association -->
          <div class="form-group">
            <label class="form-label">Destination Stop / City</label>
            <select id="edit-act-stop" class="form-control">
              ${trip.stops && trip.stops.length > 0 ? trip.stops.map(s => `
                <option value="${Utils.escapeHtml(s.cityName)}" ${s.cityName === (act.cityName || day?.city) ? 'selected' : ''}>
                  📍 ${Utils.escapeHtml(s.cityName)} (${Utils.escapeHtml(s.country || '')})
                </option>
              `).join('') : `
                <option value="${Utils.escapeHtml(act.cityName || day?.city || trip.destination)}">📍 ${Utils.escapeHtml(act.cityName || day?.city || trip.destination)}</option>
              `}
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="edit-act-category" class="form-control">
                ${CONFIG.CATEGORIES.map(c => `<option value="${c.id}" ${c.id === act.category ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Estimated Cost</label>
              <input type="number" id="edit-act-cost" class="form-control" min="0" value="${act.cost || 0}" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Time</label>
              <input type="time" id="edit-act-start-time" class="form-control" required value="${act.startTime || '10:00'}" />
            </div>
            <div class="form-group">
              <label class="form-label">End Time</label>
              <input type="time" id="edit-act-end-time" class="form-control" required value="${act.endTime || '12:00'}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Location / Address</label>
            <input type="text" id="edit-act-location" class="form-control" value="${Utils.escapeHtml(act.location || '')}" />
          </div>

          <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea id="edit-act-notes" class="form-control">${Utils.escapeHtml(act.notes || '')}</textarea>
          </div>

          <div class="modal-footer" style="padding-left: 0; padding-right: 0; margin-bottom: -0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AppRouter.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    `;
    AppRouter.openModal(modalHtml);
  },

  async handleEditActivitySubmit(event, tripId, dayNumber, activityId) {
    event.preventDefault();
    const name = document.getElementById('edit-act-name').value.trim();
    const cityName = document.getElementById('edit-act-stop')?.value || '';
    const category = document.getElementById('edit-act-category').value;
    const cost = document.getElementById('edit-act-cost').value;
    const startTime = document.getElementById('edit-act-start-time').value;
    const endTime = document.getElementById('edit-act-end-time').value;
    const location = document.getElementById('edit-act-location').value.trim();
    const notes = document.getElementById('edit-act-notes').value.trim();

    try {
      await MockApi.updateActivity(tripId, dayNumber, activityId, { name, cityName, category, cost, startTime, endTime, location, notes });
      AppRouter.closeModal();
      Utils.showToast('Activity updated!', 'success');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to update activity.', 'error');
    }
  },

  async deleteActivity(tripId, dayNumber, activityId) {
    try {
      await MockApi.deleteActivity(tripId, dayNumber, activityId);
      Utils.showToast('Activity removed.', 'info');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to delete activity.', 'error');
    }
  },

  moveActivity(tripId, dayNumber, index, direction) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    const day = trip?.days.find(d => d.dayNumber === dayNumber);
    if (!day || !day.activities) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= day.activities.length) return;

    const item = day.activities.splice(index, 1)[0];
    day.activities.splice(targetIndex, 0, item);
    AppStore.saveTrips(AppStore.trips);
    this.render(tripId);
  },

  // Edge Case: Changing trip dates after activities exist
  openEditDatesModal(tripId) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) return;

    const modalHtml = `
      <div class="modal-header">
        <div class="modal-title">🗓️ Change Trip Dates</div>
        <button class="modal-close" onclick="AppRouter.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="alert-banner alert-warning">
          <span>⚠️</span>
          <div><strong>Important Note:</strong> Shortening your date range may remove scheduled activities that fall outside the new window.</div>
        </div>

        <form id="form-edit-dates" onsubmit="ItineraryBuilderView.handleEditDatesSubmit(event, '${tripId}')">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">New Start Date</label>
              <input type="date" id="new-start-date" class="form-control" required value="${trip.startDate}" />
            </div>
            <div class="form-group">
              <label class="form-label">New End Date</label>
              <input type="date" id="new-end-date" class="form-control" required value="${trip.endDate}" />
            </div>
          </div>

          <div class="modal-footer" style="padding-left: 0; padding-right: 0; margin-bottom: -0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AppRouter.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Apply Date Changes</button>
          </div>
        </form>
      </div>
    `;
    AppRouter.openModal(modalHtml);
  },

  async handleEditDatesSubmit(event, tripId) {
    event.preventDefault();
    const newStart = document.getElementById('new-start-date').value;
    const newEnd = document.getElementById('new-end-date').value;

    if (newEnd < newStart) {
      Utils.showToast('End date must be after Start date.', 'error');
      return;
    }

    AppRouter.closeModal();
    try {
      await MockApi.updateTrip(tripId, { startDate: newStart, endDate: newEnd });
      Utils.showToast('Trip dates and itinerary days successfully updated!', 'success');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to update dates.', 'error');
    }
  },

  openAddStopModal(tripId) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) return;

    const modalHtml = `
      <div class="modal-header">
        <div class="modal-title">📍 Add Destination Stop</div>
        <button class="modal-close" onclick="AppRouter.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="form-add-stop" onsubmit="ItineraryBuilderView.handleAddStopSubmit(event, '${tripId}')">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">City Name <span class="required">*</span></label>
              <input type="text" id="stop-city" class="form-control" placeholder="e.g. Kyoto" required />
            </div>
            <div class="form-group">
              <label class="form-label">Country <span class="required">*</span></label>
              <input type="text" id="stop-country" class="form-control" placeholder="e.g. Japan" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Stop Arrival Date <span class="required">*</span></label>
              <input type="date" id="stop-arrival" class="form-control" required value="${trip.startDate}" />
            </div>
            <div class="form-group">
              <label class="form-label">Stop Departure Date <span class="required">*</span></label>
              <input type="date" id="stop-departure" class="form-control" required value="${trip.endDate}" />
            </div>
          </div>

          <div class="modal-footer" style="padding-left: 0; padding-right: 0; margin-bottom: -0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AppRouter.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Stop to Trip</button>
          </div>
        </form>
      </div>
    `;
    AppRouter.openModal(modalHtml);
  },

  async handleAddStopSubmit(event, tripId) {
    event.preventDefault();
    const city = document.getElementById('stop-city').value.trim();
    const country = document.getElementById('stop-country').value.trim();
    const arrival = document.getElementById('stop-arrival').value;
    const departure = document.getElementById('stop-departure').value;

    if (departure < arrival) {
      Utils.showToast('Departure date must be after Arrival date.', 'error');
      return;
    }

    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) return;

    if (!trip.stops) trip.stops = [];
    const newStop = {
      id: 'stop-' + Date.now(),
      cityName: city,
      country: country,
      arrivalDate: arrival,
      departureDate: departure,
      timeZone: 'UTC'
    };
    trip.stops.push(newStop);

    // If departure extends beyond trip end date, expand trip dates
    let updatedDates = {};
    if (departure > trip.endDate) {
      updatedDates.endDate = departure;
      trip.endDate = departure;
    }
    if (arrival < trip.startDate) {
      updatedDates.startDate = arrival;
      trip.startDate = arrival;
    }

    try {
      await MockApi.updateTrip(tripId, { stops: trip.stops, ...updatedDates });
      AppRouter.closeModal();
      Utils.showToast(`Stop "${city}, ${country}" successfully added to itinerary!`, 'success');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to add stop.', 'error');
    }
  },

  async moveStop(tripId, index, direction) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip || !trip.stops) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= trip.stops.length) return;

    const temp = trip.stops[index];
    trip.stops[index] = trip.stops[targetIndex];
    trip.stops[targetIndex] = temp;

    try {
      await MockApi.updateTrip(tripId, { stops: trip.stops });
      Utils.showToast(`Stop "${temp.cityName}" moved to #${targetIndex + 1}!`, 'info');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to reorder stops.', 'error');
    }
  },

  async deleteStop(tripId, stopIdentifier) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip || !trip.stops || trip.stops.length <= 1) {
      Utils.showToast('Trips must have at least one destination stop.', 'warning');
      return;
    }

    const stopToDelete = trip.stops.find(s => s.id === stopIdentifier || trip.stops.indexOf(s) == stopIdentifier);
    if (!stopToDelete) return;

    if (!confirm(`Are you sure you want to remove stop "${stopToDelete.cityName}"?`)) return;

    trip.stops = trip.stops.filter(s => s !== stopToDelete);

    try {
      await MockApi.updateTrip(tripId, { stops: trip.stops });
      Utils.showToast(`Stop "${stopToDelete.cityName}" removed.`, 'info');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to delete stop.', 'error');
    }
  }
};
