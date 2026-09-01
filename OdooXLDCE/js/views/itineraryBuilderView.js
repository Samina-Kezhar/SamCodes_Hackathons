/**
 * Screens 5 & 6: Itinerary Builder View
 * Day-wise layout, multi-city stop management, activity creator, drag-to-reorder,
 * overlapping activity conflict detection, images/times/locations, and duration adjustments.
 */

const ItineraryBuilderView = {
  activeDayNumber: 1,

  async render(tripId = null) {
    const container = document.getElementById('view-container');
    if (!container) return;

    const currentId = tripId || AppStore.currentTripId;
    if (!currentId) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3>No trip selected</h3>
          <p>Please create or choose an existing trip to build your itinerary.</p>
          <button class="btn btn-primary" onclick="AppRouter.navigate('create-trip')">Create New Trip</button>
        </div>
      `;
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
            <div style="min-width: 260px; flex: 1;">
              <div class="flex items-center gap-2" style="margin-bottom: 0.25rem; flex-wrap: wrap;">
                <span class="badge badge-primary">Itinerary Editor</span>
                <span class="badge badge-cyan">${duration} Days</span>
                <span style="font-size: 0.825rem; color: var(--text-subtle);">🗓️ ${Utils.formatDate(trip.startDate)} - ${Utils.formatDate(trip.endDate)}</span>
              </div>
              <h2 style="margin-bottom: 0.25rem;">${Utils.escapeHtml(trip.title)}</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted);">
                📍 <strong>${Utils.escapeHtml(trip.destination)}</strong> &bull; Total Expenses: <strong>${Utils.formatCurrency(totalSpent, trip.currency)}</strong> of ${Utils.formatCurrency(trip.budget, trip.currency)}
              </p>
            </div>

            <div class="flex items-center gap-2" style="flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" onclick="ItineraryBuilderView.openEditDatesModal('${trip.id}')" title="Adjust Travel Dates & Duration">
                <span>🗓️</span> Change Duration
              </button>
              <button class="btn btn-secondary btn-sm" onclick="ItineraryBuilderView.promptRegenerateItinerary('${trip.id}')" title="Auto-regenerate fresh schedule">
                <span>✨</span> Auto-Regenerate
              </button>
              <button class="btn btn-primary btn-sm" onclick="AppRouter.navigate('itinerary-view', '${trip.id}')" title="Clean Reader View">
                <span>👁️</span> Reader View
              </button>
              <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('budget', '${trip.id}')" title="Financial Breakdown">
                <span>📊</span> Budget
              </button>
              <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('shared-trip', '${trip.id}')" title="Share with friends">
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
                  <div class="day-card ${conflictData.hasConflict ? 'has-conflict' : ''}" id="day-card-${day.dayNumber}"
                    style="border-left: 4px solid ${borderColor}; margin-bottom: 1.5rem; border-radius: var(--radius-md); overflow: hidden;">
                    
                    <div class="day-card-header" style="padding: 1rem 1.25rem;">
                      <div class="flex items-center gap-3">
                        <div class="day-number-badge" style="background: ${borderColor}; color: #fff; min-width: 2.5rem; text-align: center;">Day ${day.dayNumber}</div>
                        <div>
                          <div class="font-bold" style="font-size: 0.95rem;">${Utils.formatDate(day.date)}</div>
                          <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 500;">📍 ${Utils.escapeHtml(day.city || trip.destination)}</div>
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
                    <div class="day-activities-list" id="day-act-list-${day.dayNumber}">
                      ${day.activities.length === 0 ? `
                        <div style="text-align: center; padding: 2rem 1.5rem; color: var(--text-subtle); font-size: 0.875rem;">
                          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🗓️</div>
                          No activities scheduled for Day ${day.dayNumber} yet.<br/>
                          <button class="btn btn-primary btn-sm" style="margin-top: 0.75rem;" onclick="ItineraryBuilderView.openAddActivityModal('${trip.id}', ${day.dayNumber})">
                            + Add First Activity
                          </button>
                        </div>
                      ` : day.activities.map((act, index) => {
                        const isConflicted = conflictData.conflictingIds.has(act.id);
                        const categoryMeta = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                        const actImg = act.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80';

                        return `
                          <div class="activity-item ${isConflicted ? 'conflict-overlap' : ''}" id="act-item-${act.id}" data-act-id="${act.id}">
                            <div class="activity-drag-handle" title="Reorder Activity">⋮⋮</div>
                            
                            <!-- Activity Image Thumbnail -->
                            <img src="${actImg}" alt="${Utils.escapeHtml(act.name)}" class="activity-thumb" />

                            <div class="activity-info">
                              <div class="flex items-center gap-2" style="margin-bottom: 2px; flex-wrap: wrap;">
                                <span style="font-size: 1.1rem;">${categoryMeta.icon}</span>
                                <span class="activity-name">${Utils.escapeHtml(act.name)}</span>
                                <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 0.68rem;">${categoryMeta.name}</span>
                                ${isConflicted ? `<span class="badge badge-amber" style="font-size: 0.65rem;">Overlap Conflict</span>` : ''}
                              </div>
                              <div class="activity-meta">
                                ${act.location ? `<span style="color: var(--accent-cyan);">📍 ${Utils.escapeHtml(act.location)}</span>` : ''}
                                ${act.notes ? `<span>📝 ${Utils.escapeHtml(act.notes)}</span>` : ''}
                              </div>
                            </div>

                            <div style="text-align: right; flex-shrink: 0;">
                              <div class="activity-time-tag">⏱️ ${act.startTime || '--:--'} - ${act.endTime || '--:--'}</div>
                              <div class="activity-cost-tag" style="margin-top: 4px;">
                                ${act.cost > 0 ? Utils.formatCurrency(act.cost, trip.currency) : 'Free'}
                              </div>
                            </div>

                            <div class="flex items-center gap-1" style="flex-shrink: 0;">
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
                    <span>🔍</span> Browse City Experiences
                  </button>
                  <button class="btn btn-secondary w-full" onclick="ItineraryBuilderView.openAddStopModal('${trip.id}')">
                    <span>📍</span> Add Destination Stop
                  </button>
                  <button class="btn btn-secondary w-full" onclick="ItineraryBuilderView.promptRegenerateItinerary('${trip.id}')">
                    <span>✨</span> Auto-Regenerate Schedule
                  </button>
                </div>

                <h5 style="margin-bottom: 0.75rem; font-size: 0.85rem; color: var(--text-subtle); text-transform: uppercase;">Stops & Cities</h5>
                <div class="flex flex-col gap-2" style="margin-bottom: 1.5rem;">
                  ${trip.stops && trip.stops.length > 0 ? trip.stops.map(s => `
                    <div class="glass-card-subtle flex items-center justify-between" style="padding: 0.6rem 0.85rem;">
                      <div>
                        <div class="font-semibold" style="font-size: 0.875rem;">${Utils.escapeHtml(s.cityName)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-subtle);">${Utils.formatDateShort(s.arrivalDate)} - ${Utils.formatDateShort(s.departureDate)}</div>
                      </div>
                      <span class="badge badge-cyan">${s.country || 'Global'}</span>
                    </div>
                  `).join('') : `
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
            <label class="form-label">Photo URL (Optional)</label>
            <input type="url" id="act-image" class="form-control" placeholder="https://images.unsplash.com/..." />
          </div>

          <div class="form-group">
            <label class="form-label">Notes & Booking Details</label>
            <textarea id="act-notes" class="form-control" placeholder="e.g. Voucher QR saved, meet guide at entrance"></textarea>
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
    const category = document.getElementById('act-category').value;
    const cost = document.getElementById('act-cost').value;
    const startTime = document.getElementById('act-start-time').value;
    const endTime = document.getElementById('act-end-time').value;
    const location = document.getElementById('act-location').value.trim();
    const image = document.getElementById('act-image').value.trim();
    const notes = document.getElementById('act-notes').value.trim();

    if (startTime >= endTime) {
      Utils.showToast('Activity End Time must be after Start Time.', 'error');
      return;
    }

    try {
      await MockApi.addActivity(tripId, dayNumber, { name, category, cost, startTime, endTime, location, image, notes });
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
            <label class="form-label">Photo URL</label>
            <input type="url" id="edit-act-image" class="form-control" value="${Utils.escapeHtml(act.image || '')}" />
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
    const category = document.getElementById('edit-act-category').value;
    const cost = document.getElementById('edit-act-cost').value;
    const startTime = document.getElementById('edit-act-start-time').value;
    const endTime = document.getElementById('edit-act-end-time').value;
    const location = document.getElementById('edit-act-location').value.trim();
    const image = document.getElementById('edit-act-image').value.trim();
    const notes = document.getElementById('edit-act-notes').value.trim();

    try {
      await MockApi.updateActivity(tripId, dayNumber, activityId, { name, category, cost, startTime, endTime, location, image, notes });
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

  openEditDatesModal(tripId) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) return;

    const currentDuration = Utils.daysBetween(trip.startDate, trip.endDate);

    const modalHtml = `
      <div class="modal-header">
        <div class="modal-title">🗓️ Change Stay Duration & Dates</div>
        <button class="modal-close" onclick="AppRouter.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="alert-banner alert-info" style="margin-bottom: 1.25rem;">
          <span>💡</span>
          <div><strong>Dynamic Duration:</strong> Expanding dates will automatically generate additional scheduled activities for your destination.</div>
        </div>

        <form id="form-edit-dates" onsubmit="ItineraryBuilderView.handleEditDatesSubmit(event, '${tripId}')">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input type="date" id="new-start-date" class="form-control" required value="${trip.startDate}" onchange="ItineraryBuilderView.syncDatesModalDuration()" />
            </div>
            <div class="form-group">
              <label class="form-label">End Date</label>
              <input type="date" id="new-end-date" class="form-control" required value="${trip.endDate}" onchange="ItineraryBuilderView.syncDatesModalDuration()" />
            </div>
          </div>

          <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 1rem;" id="modal-duration-preview">
            Current Duration: ${currentDuration} Days
          </div>

          <div class="modal-footer" style="padding-left: 0; padding-right: 0; margin-bottom: -0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AppRouter.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Apply Duration & Update Schedule</button>
          </div>
        </form>
      </div>
    `;
    AppRouter.openModal(modalHtml);
  },

  syncDatesModalDuration() {
    const start = document.getElementById('new-start-date')?.value;
    const end = document.getElementById('new-end-date')?.value;
    const preview = document.getElementById('modal-duration-preview');
    if (start && end && preview) {
      const s = new Date(start);
      const e = new Date(end);
      if (e >= s) {
        const days = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
        preview.innerText = `New Duration: ${days} Days`;
      }
    }
  },

  async handleEditDatesSubmit(event, tripId) {
    event.preventDefault();
    const startDate = document.getElementById('new-start-date').value;
    const endDate = document.getElementById('new-end-date').value;

    if (endDate < startDate) {
      Utils.showToast('End date must be on or after start date.', 'error');
      return;
    }

    try {
      await MockApi.updateTrip(tripId, { startDate, endDate });
      AppRouter.closeModal();
      Utils.showToast('Trip duration updated with adjusted schedule!', 'success');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to update dates.', 'error');
    }
  },

  async promptRegenerateItinerary(tripId) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) return;

    if (confirm(`Auto-regenerate the entire day-by-day schedule for "${trip.destination}"?`)) {
      try {
        await MockApi.regenerateItinerary(tripId, trip.destination, trip.startDate, trip.endDate);
        Utils.showToast(`✨ Itinerary for ${trip.destination} refreshed with new activities!`, 'success');
        this.render(tripId);
      } catch (err) {
        Utils.showToast('Failed to regenerate itinerary.', 'error');
      }
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
          <div class="form-group">
            <label class="form-label">City / Destination Name <span class="required">*</span></label>
            <input type="text" id="stop-city" class="form-control" placeholder="e.g. Kyoto or Interlaken" required />
          </div>

          <div class="form-group">
            <label class="form-label">Country</label>
            <input type="text" id="stop-country" class="form-control" placeholder="e.g. Japan" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Arrival Date</label>
              <input type="date" id="stop-arr-date" class="form-control" value="${trip.startDate}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Departure Date</label>
              <input type="date" id="stop-dep-date" class="form-control" value="${trip.endDate}" required />
            </div>
          </div>

          <div class="modal-footer" style="padding-left: 0; padding-right: 0; margin-bottom: -0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AppRouter.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Stop</button>
          </div>
        </form>
      </div>
    `;
    AppRouter.openModal(modalHtml);
  },

  async handleAddStopSubmit(event, tripId) {
    event.preventDefault();
    const cityName = document.getElementById('stop-city').value.trim();
    const country = document.getElementById('stop-country').value.trim() || 'Global';
    const arrivalDate = document.getElementById('stop-arr-date').value;
    const departureDate = document.getElementById('stop-dep-date').value;

    const trip = AppStore.trips.find(t => t.id === tripId);
    if (!trip) return;

    if (!trip.stops) trip.stops = [];
    trip.stops.push({
      id: 'stop-' + Date.now(),
      cityName,
      country,
      arrivalDate,
      departureDate,
      timeZone: 'UTC'
    });

    AppStore.saveTrips(AppStore.trips);
    AppRouter.closeModal();
    Utils.showToast(`Stop "${cityName}" added!`, 'success');
    this.render(tripId);
  }
};
