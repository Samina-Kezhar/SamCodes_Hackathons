/**
 * Screen 10: Trip Calendar & Chronological Timeline View
 * Interactive calendar day cell visualizer, expandable timeline, reorder controls, quick editing options, and time-zone toggle awareness.
 */

const CalendarView = {
  useDestinationTime: true,
  selectedDayFocus: 1,

  async render(tripId = null) {
    const container = document.getElementById('view-container');
    if (!container) return;

    const currentId = tripId || AppStore.currentTripId;
    const response = await MockApi.getTripById(currentId);
    const trip = response.data;

    const duration = Utils.daysBetween(trip.startDate, trip.endDate);
    const timeZoneNotice = this.useDestinationTime 
      ? `Destination Local Time (${trip.stops?.[0]?.timeZone || 'GMT+2 Central Europe'})` 
      : `Your Device Time (${Intl.DateTimeFormat().resolvedOptions().timeZone})`;

    // Generate Calendar Grid Component Data
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const monthName = startDate.toLocaleString('default', { month: 'long' });

    // Days in current trip month
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const adjustedFirstDay = (firstDayIndex === 0 ? 6 : firstDayIndex - 1); // 0 = Mon
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarCells = [];
    // Padding before 1st of month
    for (let p = 0; p < adjustedFirstDay; p++) {
      calendarCells.push({ empty: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const tripDay = trip.days.find(td => td.date === dateStr);
      calendarCells.push({
        dayOfMonth: d,
        dateStr,
        tripDay: tripDay || null
      });
    }

    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1060px; margin: 0 auto; padding-bottom: 3rem;">
        <!-- Header -->
        <div class="glass-card flex items-center justify-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="flex items-center gap-2" style="margin-bottom: 0.35rem;">
              <span class="badge badge-primary">Calendar & Flow</span>
              <span class="badge badge-cyan">${duration} Days Journey</span>
            </div>
            <h2>Interactive Schedule: <span class="text-gradient">${Utils.escapeHtml(trip.title)}</span></h2>
            <p>Calendar grid and vertical day stream with quick editing & reordering.</p>
          </div>

          <div class="flex items-center gap-2">
            <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('itinerary-builder', '${trip.id}')">
              &larr; Builder
            </button>
            <button class="btn btn-secondary btn-sm" onclick="AppRouter.navigate('itinerary-view', '${trip.id}')">
              <span>👁️</span> Reader View
            </button>
            <button class="btn btn-primary btn-sm" onclick="AppRouter.navigate('budget', '${trip.id}')">
              <span>📊</span> View Budget
            </button>
          </div>
        </div>

        <!-- Time Zone Awareness Info Banner (Edge Case) -->
        <div class="alert-banner alert-info flex items-center justify-between" style="flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem;">
          <div class="flex items-center gap-2">
            <span>🌐</span>
            <div>
              <strong>Time Zone Sync:</strong> Currently displaying in <u>${timeZoneNotice}</u>.
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="CalendarView.toggleTimeZone('${trip.id}')">
            Switch to ${this.useDestinationTime ? 'My Local Time' : 'Destination Time'}
          </button>
        </div>

        <!-- 1. Interactive Monthly Calendar Grid Component -->
        <div class="glass-card" style="margin-bottom: 2rem; padding: 1.5rem;">
          <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
            <div class="flex items-center gap-2">
              <span style="font-size: 1.35rem;">📅</span>
              <h3 style="font-size: 1.15rem; margin-bottom: 0;">${monthName} ${year}</h3>
            </div>
            <span style="font-size: 0.8rem; color: var(--text-subtle);">Click any scheduled date to jump to that day</span>
          </div>

          <!-- Weekday Headers -->
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; text-align: center; font-size: 0.78rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>

          <!-- Calendar Days Grid -->
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;">
            ${calendarCells.map(cell => {
              if (cell.empty) {
                return `<div style="min-height: 64px; background: rgba(255,255,255,0.01); border-radius: var(--radius-xs); opacity: 0.2;"></div>`;
              }

              const isTripDay = !!cell.tripDay;
              const actCount = cell.tripDay?.activities?.length || 0;
              const isFocused = cell.tripDay?.dayNumber === this.selectedDayFocus;

              return `
                <div onclick="${isTripDay ? `CalendarView.scrollToDay(${cell.tripDay.dayNumber})` : ''}"
                  style="min-height: 64px; padding: 6px 8px; border-radius: var(--radius-xs); cursor: ${isTripDay ? 'pointer' : 'default'}; 
                    background: ${isFocused ? 'rgba(99, 102, 241, 0.25)' : isTripDay ? 'var(--surface-2)' : 'rgba(255,255,255,0.02)'}; 
                    border: 1px solid ${isFocused ? 'var(--primary-500)' : isTripDay ? 'var(--accent-cyan)' : 'transparent'};
                    transition: all 0.2s ease;">
                  <div class="flex items-center justify-between">
                    <span style="font-size: 0.85rem; font-weight: ${isTripDay ? '700' : '400'}; color: ${isTripDay ? 'var(--text-main)' : 'var(--text-subtle)'};">
                      ${cell.dayOfMonth}
                    </span>
                    ${isTripDay ? `
                      <span class="badge badge-cyan" style="font-size: 0.65rem; padding: 1px 5px;">Day ${cell.tripDay.dayNumber}</span>
                    ` : ''}
                  </div>
                  ${isTripDay ? `
                    <div style="margin-top: 6px; font-size: 0.72rem; color: var(--accent-emerald); font-weight: 600;">
                      ${actCount} item${actCount === 1 ? '' : 's'}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. Chronological Expandable Day Stream with Reordering & Quick Editing -->
        <div class="section-header" style="margin-bottom: 1rem;">
          <div class="section-title">
            <span>⏱️</span> Vertical Timeline Stream (${trip.days.length} Days)
          </div>
        </div>

        <div class="flex flex-col gap-4">
          ${trip.days.map(day => {
            const conflictData = Utils.detectActivityConflicts(day.activities);
            const totalCost = day.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0);

            return `
              <div class="glass-card" id="cal-day-card-${day.dayNumber}" style="padding: 1.25rem; transition: border-color 0.3s ease;">
                <div class="flex items-center justify-between" style="cursor: pointer;" onclick="CalendarView.toggleDayExpansion(${day.dayNumber})">
                  <div class="flex items-center gap-3">
                    <div class="day-number-badge">Day ${day.dayNumber}</div>
                    <div>
                      <h4 style="margin-bottom: 2px;">${Utils.formatDate(day.date)}</h4>
                      <div style="font-size: 0.8rem; color: var(--accent-cyan);">📍 ${Utils.escapeHtml(day.city || trip.destination)}</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    ${conflictData.hasConflict ? `<span class="badge badge-amber">⚠️ Overlap</span>` : ''}
                    <span style="font-size: 0.85rem; color: var(--text-muted);">${day.activities.length} item${day.activities.length === 1 ? '' : 's'}</span>
                    <span class="font-bold" style="color: var(--accent-emerald); font-size: 0.95rem;">${Utils.formatCurrency(totalCost, trip.currency)}</span>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); ItineraryBuilderView.openAddActivityModal('${trip.id}', ${day.dayNumber})" title="Quick Add Activity">
                      + Add
                    </button>
                    <span id="exp-icon-${day.dayNumber}" style="font-size: 1.1rem; color: var(--text-subtle); transition: transform 0.2s ease;">▼</span>
                  </div>
                </div>

                <!-- Expanded Content -->
                <div id="day-content-${day.dayNumber}" style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--glass-border);">
                  ${day.activities.length === 0 ? `
                    <div style="font-size: 0.85rem; color: var(--text-subtle); font-style: italic;">No activities planned for this date. Click "+ Add" above to schedule an item.</div>
                  ` : `
                    <div style="position: relative; padding-left: 1.5rem; border-left: 2px solid var(--surface-3); margin-left: 0.5rem;">
                      ${day.activities.map((act, actIdx) => {
                        const cat = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                        return `
                          <div style="position: relative; margin-bottom: 1rem;">
                            <div style="position: absolute; left: -1.95rem; top: 12px; width: 12px; height: 12px; border-radius: 50%; background: ${cat.color}; border: 2px solid var(--bg-app);"></div>
                            <div class="glass-card-subtle flex items-center justify-between" style="padding: 0.75rem 1rem; gap: 0.75rem; flex-wrap: wrap;">
                              <div style="min-width: 0; flex: 1 1 240px;">
                                <div class="flex items-center gap-2">
                                  <span>${cat.icon}</span>
                                  <strong style="font-size: 0.9rem;">${Utils.escapeHtml(act.name)}</strong>
                                </div>
                                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                                  ${act.cityName ? `🏙️ ${Utils.escapeHtml(act.cityName)} &bull; ` : ''}
                                  ${act.location ? `📍 ${Utils.escapeHtml(act.location)}` : ''}
                                </div>
                              </div>

                              <div class="flex items-center gap-3">
                                <div style="text-align: right;">
                                  <div class="activity-time-tag">${act.startTime} - ${act.endTime}</div>
                                  <div style="font-size: 0.825rem; font-weight: 700; color: var(--accent-emerald); margin-top: 2px;">
                                    ${Utils.formatCurrency(act.cost, trip.currency)}
                                  </div>
                                </div>

                                <!-- Drag-to-Reorder & Quick Editing Options -->
                                <div class="flex items-center gap-1">
                                  ${actIdx > 0 ? `
                                    <button class="btn btn-ghost btn-sm" style="padding: 3px 6px; font-size: 0.75rem;" onclick="CalendarView.moveActivity('${trip.id}', ${day.dayNumber}, ${actIdx}, -1)" title="Move earlier">▲</button>
                                  ` : ''}
                                  ${actIdx < day.activities.length - 1 ? `
                                    <button class="btn btn-ghost btn-sm" style="padding: 3px 6px; font-size: 0.75rem;" onclick="CalendarView.moveActivity('${trip.id}', ${day.dayNumber}, ${actIdx}, 1)" title="Move later">▼</button>
                                  ` : ''}
                                  <button class="btn btn-ghost btn-sm" style="padding: 3px 6px; font-size: 0.8rem;" onclick="CalendarView.openQuickEditModal('${trip.id}', ${day.dayNumber}, '${act.id}')" title="Quick edit timing & details">✏️</button>
                                  <button class="btn btn-ghost btn-sm" style="padding: 3px 6px; color: var(--accent-rose); font-size: 0.8rem;" onclick="CalendarView.deleteActivity('${trip.id}', ${day.dayNumber}, '${act.id}')" title="Delete activity">🗑️</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  scrollToDay(dayNumber) {
    this.selectedDayFocus = dayNumber;
    const card = document.getElementById(`cal-day-card-${dayNumber}`);
    const content = document.getElementById(`day-content-${dayNumber}`);
    const icon = document.getElementById(`exp-icon-${dayNumber}`);
    if (content && content.style.display === 'none') {
      content.style.display = 'block';
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.borderColor = 'var(--accent-cyan)';
      setTimeout(() => { card.style.borderColor = ''; }, 1200);
    }
  },

  toggleTimeZone(tripId) {
    this.useDestinationTime = !this.useDestinationTime;
    Utils.showToast(`Switched calendar time reference!`, 'info');
    this.render(tripId);
  },

  toggleDayExpansion(dayNumber) {
    const content = document.getElementById(`day-content-${dayNumber}`);
    const icon = document.getElementById(`exp-icon-${dayNumber}`);
    if (!content || !icon) return;

    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    icon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
  },

  async moveActivity(tripId, dayNumber, actIndex, direction) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    const day = trip?.days.find(d => d.dayNumber === dayNumber);
    if (!day || !day.activities) return;

    const targetIdx = actIndex + direction;
    if (targetIdx < 0 || targetIdx >= day.activities.length) return;

    const temp = day.activities[actIndex];
    day.activities[actIndex] = day.activities[targetIdx];
    day.activities[targetIdx] = temp;

    try {
      await MockApi.updateTrip(tripId, { days: trip.days });
      Utils.showToast(`Reordered "${temp.name}"!`, 'info');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to reorder activity.', 'error');
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

  openQuickEditModal(tripId, dayNumber, activityId) {
    const trip = AppStore.trips.find(t => t.id === tripId);
    const day = trip?.days.find(d => d.dayNumber === dayNumber);
    const act = day?.activities.find(a => a.id === activityId);
    if (!act) return;

    const modalHtml = `
      <div class="modal-header">
        <div class="modal-title">⚡ Quick Edit Activity</div>
        <button class="modal-close" onclick="AppRouter.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="form-quick-edit" onsubmit="CalendarView.handleQuickEditSubmit(event, '${tripId}', ${dayNumber}, '${activityId}')">
          <div class="form-group">
            <label class="form-label">Activity Name <span class="required">*</span></label>
            <input type="text" id="quick-act-name" class="form-control" required value="${Utils.escapeHtml(act.name)}" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Time</label>
              <input type="time" id="quick-act-start" class="form-control" required value="${act.startTime}" />
            </div>
            <div class="form-group">
              <label class="form-label">End Time</label>
              <input type="time" id="quick-act-end" class="form-control" required value="${act.endTime}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Cost (${trip.currency})</label>
            <input type="number" id="quick-act-cost" class="form-control" min="0" value="${act.cost || 0}" />
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

  async handleQuickEditSubmit(event, tripId, dayNumber, activityId) {
    event.preventDefault();
    const name = document.getElementById('quick-act-name').value.trim();
    const startTime = document.getElementById('quick-act-start').value;
    const endTime = document.getElementById('quick-act-end').value;
    const cost = Number(document.getElementById('quick-act-cost').value) || 0;

    try {
      await MockApi.updateActivity(tripId, dayNumber, activityId, { name, startTime, endTime, cost });
      AppRouter.closeModal();
      Utils.showToast('Activity updated!', 'success');
      this.render(tripId);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to update activity.', 'error');
    }
  }
};
