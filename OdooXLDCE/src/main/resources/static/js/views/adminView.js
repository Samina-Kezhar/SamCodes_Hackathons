/**
 * Screen 13: Admin & Platform Analytics Dashboard
 * High-level adoption statistics, trips monitor, top activities ranking,
 * user management tools, and destination popularity.
 */

const AdminView = {
  currentTab: 'overview', // 'overview' | 'trips' | 'activities' | 'users'
  usersData: null,

  getUsers() {
    if (!this.usersData) {
      try {
        const stored = localStorage.getItem('globetrotter_admin_users');
        if (stored) {
          this.usersData = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to load admin users', e);
      }
      if (!this.usersData) {
        this.usersData = [
          { id: 'usr-1', name: 'Alex River', email: 'alex.river@globetrotter.io', role: 'Traveler', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', joined: 'Jan 2026', tripsCount: 3 },
          { id: 'usr-2', name: 'Elena Rostova', email: 'elena.rostova@globetrotter.io', role: 'Guide', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', joined: 'Feb 2026', tripsCount: 7 },
          { id: 'usr-3', name: 'Carlos Silva', email: 'carlos.silva@journey.net', role: 'Traveler', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', joined: 'Mar 2026', tripsCount: 4 },
          { id: 'usr-4', name: 'Sophia Chen', email: 'sophia.chen@wander.org', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', joined: 'Dec 2025', tripsCount: 9 },
          { id: 'usr-5', name: 'Marcus Vance', email: 'marcus.v@voyage.co', role: 'Traveler', status: 'Suspended', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', joined: 'Apr 2026', tripsCount: 1 }
        ];
        this.saveUsers();
      }
    }
    return this.usersData;
  },

  saveUsers() {
    try {
      localStorage.setItem('globetrotter_admin_users', JSON.stringify(this.usersData));
    } catch (e) {
      console.warn('Failed to save admin users', e);
    }
  },

  setTab(tab) {
    this.currentTab = tab;
    this.render();
  },

  toggleUserStatus(userId) {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.status = target.status === 'Active' ? 'Suspended' : 'Active';
      this.saveUsers();
      if (typeof showToast === 'function') {
        showToast(`User ${target.name} status updated to ${target.status}`, target.status === 'Active' ? 'success' : 'warning');
      }
      this.render();
    }
  },

  resetUserPassword(userId) {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      if (typeof showToast === 'function') {
        showToast(`Password reset link dispatched to ${target.email}`, 'info');
      }
    }
  },

  changeUserRole(userId, newRole) {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.role = newRole;
      this.saveUsers();
      if (typeof showToast === 'function') {
        showToast(`Role for ${target.name} changed to ${newRole}`, 'success');
      }
      this.render();
    }
  },

  inspectTrip(tripId) {
    const localTrip = AppStore.trips.find(t => t.id === tripId);
    if (localTrip) {
      AppStore.setCurrentTripId(tripId);
      AppRouter.navigate('itinerary');
    } else {
      if (typeof showToast === 'function') {
        showToast(`Viewing platform telemetry for trip ${tripId}`, 'info');
      }
    }
  },

  render() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const trips = AppStore.trips;
    const totalTrips = trips.length;
    let totalActivities = 0;
    trips.forEach(t => (t.days || []).forEach(d => totalActivities += (d.activities || []).length));

    const users = this.getUsers();

    // Prepare top activities
    const topActivities = [...(CONFIG.ACTIVITIES_CATALOG || [])]
      .sort((a, b) => (b.cost || 0) - (a.cost || 0))
      .slice(0, 8);

    // Prepare platform trips
    const platformTrips = [
      ...trips.map(t => ({
        id: t.id,
        title: t.title,
        traveler: AppStore.user?.name || 'Alex River',
        email: AppStore.user?.email || 'alex.river@globetrotter.io',
        destinations: (t.destinations || []).map(d => d.name).join(', ') || 'Custom Itinerary',
        dates: `${t.startDate || '2026-06-01'} to ${t.endDate || '2026-06-07'}`,
        budget: `$${t.budget || 1500}`,
        status: 'Active',
        isLocal: true
      })),
      {
        id: 'plat-1',
        title: 'Nordic Aurora & Fjords Expedition',
        traveler: 'Elena Rostova',
        email: 'elena.rostova@globetrotter.io',
        destinations: 'Tromsø, Bergen, Oslo',
        dates: '2026-09-14 to 2026-09-22',
        budget: '$3,450',
        status: 'Confirmed',
        isLocal: false
      },
      {
        id: 'plat-2',
        title: 'Iberian Coast & Gastronomy Trail',
        traveler: 'Carlos Silva',
        email: 'carlos.silva@journey.net',
        destinations: 'Barcelona, Madrid, Seville',
        dates: '2026-10-02 to 2026-10-09',
        budget: '$2,100',
        status: 'Planning',
        isLocal: false
      },
      {
        id: 'plat-3',
        title: 'Kyoto Zen Gardens & Culinary Retreat',
        traveler: 'Sophia Chen',
        email: 'sophia.chen@wander.org',
        destinations: 'Kyoto, Nara, Osaka',
        dates: '2026-11-05 to 2026-11-12',
        budget: '$2,850',
        status: 'In Progress',
        isLocal: false
      }
    ];

    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 1160px; margin: 0 auto; padding-bottom: 3rem;">
        <!-- Header -->
        <div class="glass-card flex items-center justify-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="flex items-center gap-2" style="margin-bottom: 0.35rem;">
              <span class="badge badge-purple">Admin Control Panel</span>
              <span class="badge badge-emerald">System Healthy (99.98% Uptime)</span>
              <span class="badge badge-cyan">Latency: 14ms</span>
            </div>
            <h2>Platform <span class="text-gradient">Analytics & Control</span></h2>
            <p>Real-time metrics, itinerary telemetry, destination ratings, and user access management.</p>
          </div>

          <div class="flex items-center gap-2">
            <button class="btn btn-secondary btn-sm" onclick="AppStore.resetToDemo(); AdminView.render(); showToast('Platform cache reset to demo state', 'info');">
              🔄 Reset Demo State
            </button>
            <button class="btn btn-primary btn-sm" onclick="AppRouter.navigate('dashboard')">
              &larr; Traveler Dashboard
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="view-tabs" style="margin-bottom: 1.5rem;">
          <button class="view-tab ${this.currentTab === 'overview' ? 'active' : ''}" onclick="AdminView.setTab('overview')">
            📊 Overview & KPIs
          </button>
          <button class="view-tab ${this.currentTab === 'trips' ? 'active' : ''}" onclick="AdminView.setTab('trips')">
            🗺️ Trips Monitor (${platformTrips.length})
          </button>
          <button class="view-tab ${this.currentTab === 'activities' ? 'active' : ''}" onclick="AdminView.setTab('activities')">
            🎯 Top Activities (${topActivities.length})
          </button>
          <button class="view-tab ${this.currentTab === 'users' ? 'active' : ''}" onclick="AdminView.setTab('users')">
            👥 User Management (${users.length})
          </button>
        </div>

        <!-- TAB 1: OVERVIEW & KPIS -->
        ${this.currentTab === 'overview' ? `
          <!-- Metric Cards -->
          <div class="stats-grid" style="margin-bottom: 2rem;">
            <div class="glass-card stat-card">
              <div class="stat-icon-wrapper" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">👥</div>
              <div>
                <div class="stat-value">12,480</div>
                <div class="stat-label">Active Travelers</div>
                <div style="font-size: 0.75rem; color: #34d399; margin-top: 2px;">↑ 14.2% MoM</div>
              </div>
            </div>

            <div class="glass-card stat-card">
              <div class="stat-icon-wrapper" style="background: rgba(99, 102, 241, 0.15); color: #818cf8;">🗺️</div>
              <div>
                <div class="stat-value">${totalTrips + 8420}</div>
                <div class="stat-label">Total Trips Created</div>
                <div style="font-size: 0.75rem; color: #818cf8; margin-top: 2px;">${totalTrips} local session</div>
              </div>
            </div>

            <div class="glass-card stat-card">
              <div class="stat-icon-wrapper" style="background: rgba(6, 182, 212, 0.15); color: #22d3ee;">🎯</div>
              <div>
                <div class="stat-value">${totalActivities + 34200}</div>
                <div class="stat-label">Activities Scheduled</div>
                <div style="font-size: 0.75rem; color: #22d3ee; margin-top: 2px;">Avg 4.1 / day</div>
              </div>
            </div>

            <div class="glass-card stat-card">
              <div class="stat-icon-wrapper" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">⭐</div>
              <div>
                <div class="stat-value">4.92 / 5</div>
                <div class="stat-label">Satisfaction Score</div>
                <div style="font-size: 0.75rem; color: #34d399; margin-top: 2px;">98.4% positive</div>
              </div>
            </div>
          </div>

          <!-- Top Destinations Breakdown -->
          <div class="glass-card" style="margin-bottom: 2rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
              <div>
                <h3>🏆 Most Popular Destinations</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Ranked by global bookings, traveler reviews, and engagement metrics.</p>
              </div>
              <span class="badge badge-purple">${CONFIG.DESTINATIONS.length} Cities Monitored</span>
            </div>

            <div class="flex flex-col gap-3">
              ${CONFIG.DESTINATIONS.slice(0, 6).map((dest, idx) => `
                <div class="glass-card-subtle flex items-center justify-between" style="padding: 0.85rem 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                  <div class="flex items-center gap-3">
                    <span class="day-number-badge" style="background: var(--surface-3); font-size: 0.8rem; font-weight: 700;">#${idx + 1}</span>
                    <img src="${dest.image}" style="width: 46px; height: 46px; border-radius: var(--radius-xs); object-fit: cover;" />
                    <div>
                      <strong style="font-size: 0.95rem;">${dest.name}, ${dest.country}</strong>
                      <div style="font-size: 0.78rem; color: var(--accent-cyan);">${dest.region} &bull; Cost Index: ${dest.costIndex} &bull; Avg $${dest.avgDailyCost}/day</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-6">
                    <div style="text-align: right;">
                      <span style="font-weight: 700; color: #fbbf24;">★ ${dest.rating}</span>
                      <div style="font-size: 0.75rem; color: var(--text-subtle);">${Math.round(dest.popularity * 435)} bookings</div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="DashboardView.planTripToDestination('${dest.id}')">
                      Plan Trip
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- TAB 2: TRIPS MONITOR -->
        ${this.currentTab === 'trips' ? `
          <div class="glass-card">
            <div class="flex items-center justify-between" style="margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3>🗺️ Platform Trips Monitor</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Real-time feed of multi-city itineraries generated across the platform.</p>
              </div>
              <div class="badge badge-cyan">${platformTrips.length} Total Trips Displayed</div>
            </div>

            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Trip Title</th>
                    <th>Traveler</th>
                    <th>Destinations / Stops</th>
                    <th>Travel Dates</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${platformTrips.map(trip => `
                    <tr>
                      <td>
                        <strong>${escapeHTML(trip.title)}</strong>
                        ${trip.isLocal ? '<span class="badge badge-purple" style="font-size: 0.7rem; margin-left: 4px;">Current</span>' : ''}
                      </td>
                      <td>
                        <div>${escapeHTML(trip.traveler)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-subtle);">${escapeHTML(trip.email)}</div>
                      </td>
                      <td><span style="color: var(--accent-cyan);">${escapeHTML(trip.destinations)}</span></td>
                      <td style="font-size: 0.82rem; white-space: nowrap;">${escapeHTML(trip.dates)}</td>
                      <td style="font-weight: 600; color: #34d399;">${escapeHTML(trip.budget)}</td>
                      <td>
                        <span class="badge ${trip.status === 'Active' || trip.status === 'Confirmed' ? 'badge-emerald' : trip.status === 'In Progress' ? 'badge-cyan' : 'badge-purple'}">
                          ${escapeHTML(trip.status)}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-sm" onclick="AdminView.inspectTrip('${trip.id}')">
                          ${trip.isLocal ? 'Open Builder' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- TAB 3: TOP ACTIVITIES -->
        ${this.currentTab === 'activities' ? `
          <div class="glass-card">
            <div class="flex items-center justify-between" style="margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3>🎯 Top Activities & Experiences</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Highest grossing and top rated experiences across all destinations.</p>
              </div>
              <span class="badge badge-emerald">Verified Sights</span>
            </div>

            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Rank & Experience</th>
                    <th>City / Destination</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Est. Bookings</th>
                    <th>Inspect</th>
                  </tr>
                </thead>
                <tbody>
                  ${topActivities.map((act, index) => `
                    <tr>
                      <td>
                        <div class="flex items-center gap-3">
                          <span class="day-number-badge" style="background: var(--surface-3); font-size: 0.78rem; font-weight: 700;">#${index + 1}</span>
                          <img src="${act.image}" style="width: 42px; height: 42px; border-radius: var(--radius-xs); object-fit: cover;" />
                          <div>
                            <strong>${escapeHTML(act.name)}</strong>
                          </div>
                        </div>
                      </td>
                      <td><span style="color: var(--accent-cyan); font-weight: 500;">${escapeHTML(act.cityName)}</span></td>
                      <td>
                        <span class="badge ${act.category === 'sightseeing' ? 'badge-purple' : act.category === 'food' ? 'badge-amber' : act.category === 'culture' ? 'badge-cyan' : 'badge-emerald'}">
                          ${escapeHTML(act.category.toUpperCase())}
                        </span>
                      </td>
                      <td style="font-size: 0.82rem; color: var(--text-muted);">${escapeHTML(act.duration)}</td>
                      <td style="font-weight: 600; color: #34d399;">$${act.cost}</td>
                      <td><span style="font-weight: 700; color: #fbbf24;">★ 4.9</span></td>
                      <td style="font-size: 0.85rem;">${Math.round((act.cost * 18) + 420)}</td>
                      <td>
                        <button class="btn btn-secondary btn-sm" onclick="SearchView.openActivityQuickView('${act.id}')">
                          View Details
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- TAB 4: USER MANAGEMENT TOOLS -->
        ${this.currentTab === 'users' ? `
          <div class="glass-card">
            <div class="flex items-center justify-between" style="margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3>👥 User Access & Account Management</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Manage member profiles, roles, account standing, and credential resets.</p>
              </div>
              <span class="badge badge-purple">${users.length} Registered Accounts</span>
            </div>

            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Member Since</th>
                    <th>Trips Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(u => `
                    <tr>
                      <td>
                        <div class="flex items-center gap-3">
                          <img src="${u.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" />
                          <strong>${escapeHTML(u.name)}</strong>
                        </div>
                      </td>
                      <td style="font-size: 0.84rem; color: var(--text-muted);">${escapeHTML(u.email)}</td>
                      <td>
                        <select class="form-control" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; width: auto;" onchange="AdminView.changeUserRole('${u.id}', this.value)">
                          <option value="Traveler" ${u.role === 'Traveler' ? 'selected' : ''}>Traveler</option>
                          <option value="Guide" ${u.role === 'Guide' ? 'selected' : ''}>Guide</option>
                          <option value="Admin" ${u.role === 'Admin' ? 'selected' : ''}>Admin</option>
                        </select>
                      </td>
                      <td>
                        <span class="badge ${u.status === 'Active' ? 'badge-emerald' : 'badge-rose'}">
                          ${escapeHTML(u.status)}
                        </span>
                      </td>
                      <td style="font-size: 0.82rem; color: var(--text-subtle);">${escapeHTML(u.joined)}</td>
                      <td style="font-weight: 600; text-align: center;">${u.tripsCount}</td>
                      <td>
                        <div class="flex items-center gap-2">
                          <button class="btn btn-sm ${u.status === 'Active' ? 'btn-secondary' : 'btn-primary'}" onclick="AdminView.toggleUserStatus('${u.id}')">
                            ${u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button class="btn btn-secondary btn-sm" title="Send Password Reset" onclick="AdminView.resetUserPassword('${u.id}')">
                            🔑 Reset
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
};
