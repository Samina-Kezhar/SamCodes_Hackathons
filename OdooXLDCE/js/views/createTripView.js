/**
 * Screen 3: Create / Edit Trip & Itinerary Customizer View
 * Destination picker, stay duration customizer (number of days), auto-generated itinerary generator,
 * date validation, cover photo picker, and budget estimation.
 */

const CreateTripView = {
  selectedCoverUrl: CONFIG.COVER_PRESETS[0].url,
  selectedTags: ['Culture', 'Adventure'],
  selectedDurationDays: 7,
  selectedDestinationId: null,

  render(prefillData = null) {
    const container = document.getElementById('view-container');
    if (!container) return;

    // Default dates: tomorrow to tomorrow + 6 days (7 days total)
    this.selectedDurationDays = prefillData?.durationDays || 7;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const end = new Date(tomorrow);
    end.setDate(tomorrow.getDate() + (this.selectedDurationDays - 1));

    const defaultStart = tomorrow.toISOString().split('T')[0];
    const defaultEnd = end.toISOString().split('T')[0];

    const initialDest = prefillData?.destination || 'Tokyo, Japan';
    const title = prefillData?.title || (prefillData?.destination ? `Adventure to ${prefillData.destination}` : `7 Days in Tokyo, Japan`);
    const budget = prefillData?.budget || (this.selectedDurationDays * 180);
    this.selectedCoverUrl = prefillData?.coverImage || CONFIG.COVER_PRESETS[1].url;

    const availableTags = ['Culture', 'Adventure', 'Foodie', 'Relax', 'Luxury', 'Budget', 'Solo', 'Family'];

    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 920px; margin: 0 auto;">
        <!-- Page Header -->
        <div class="flex items-center justify-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-primary" style="margin-bottom: 0.5rem;">Intelligent Travel Planner</div>
            <h1>Plan <span class="text-gradient">Your Dream Journey</span></h1>
            <p>Select a destination, specify your stay duration, and receive an instant auto-generated day-by-day itinerary.</p>
          </div>
          <button class="btn btn-secondary" onclick="AppRouter.navigate('dashboard')">
            &larr; Back to Dashboard
          </button>
        </div>

        <form id="form-create-trip" class="glass-card" onsubmit="CreateTripView.handleSubmit(event)">
          <!-- Quick Destination Cards Selector -->
          <div class="form-group">
            <label class="form-label">
              <span>✨ Popular Destinations (1-Click Selection)</span>
              <span style="font-size: 0.78rem; font-weight: normal; color: var(--text-muted); margin-left: 0.5rem;">Click any destination to auto-populate</span>
            </label>
            <div class="dest-quick-grid" id="dest-quick-grid-container">
              ${CONFIG.DESTINATIONS.slice(0, 10).map(dest => `
                <div class="dest-quick-card ${dest.name.toLowerCase() === 'tokyo' ? 'selected' : ''}" 
                  onclick="CreateTripView.selectDestinationPreset('${dest.id}', this)">
                  <img src="${dest.image}" alt="${dest.name}" class="dest-quick-img" />
                  <div class="dest-quick-name">${dest.name}</div>
                  <div class="dest-quick-country">${dest.country}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Trip Destination & Title -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="trip-destination">Destination (City or Country) <span class="required">*</span></label>
              <input type="text" id="trip-destination" class="form-control" 
                placeholder="e.g. Paris, France or Kyoto, Japan or Rome, Italy" 
                required value="${Utils.escapeHtml(initialDest)}" 
                oninput="CreateTripView.handleDestinationInput(this.value)" />
              <div class="form-hint">Type any city or country worldwide for auto-generation.</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="trip-title">Trip Title <span class="required">*</span></label>
              <input type="text" id="trip-title" class="form-control" 
                placeholder="e.g. 7 Days in Tokyo, Japan" 
                required value="${Utils.escapeHtml(title)}" />
              <div class="form-error hidden" id="trip-title-error"></div>
            </div>
          </div>

          <!-- Stay Duration Customization (Number of Days) -->
          <div class="form-group" style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: var(--radius-sm); padding: 1.25rem;">
            <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
              <label class="form-label" style="margin-bottom: 0;">
                <span>⏱️ Stay Duration (Number of Days) <span class="required">*</span></span>
              </label>
              <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 600;" id="duration-summary-text">
                Planning a ${this.selectedDurationDays}-day itinerary
              </div>
            </div>

            <!-- Quick Duration Pills & Stepper -->
            <div class="duration-picker-wrap">
              <div class="duration-stepper">
                <button type="button" class="duration-stepper-btn" onclick="CreateTripView.adjustDuration(-1)" title="Decrease duration">&minus;</button>
                <div class="duration-stepper-val" id="duration-stepper-display">${this.selectedDurationDays} Days</div>
                <button type="button" class="duration-stepper-btn" onclick="CreateTripView.adjustDuration(1)" title="Increase duration">&plus;</button>
              </div>

              <button type="button" class="duration-pill ${this.selectedDurationDays === 3 ? 'active' : ''}" onclick="CreateTripView.setDurationDays(3, this)">
                3 Days (Weekend)
              </button>
              <button type="button" class="duration-pill ${this.selectedDurationDays === 5 ? 'active' : ''}" onclick="CreateTripView.setDurationDays(5, this)">
                5 Days (Express)
              </button>
              <button type="button" class="duration-pill ${this.selectedDurationDays === 7 ? 'active' : ''}" onclick="CreateTripView.setDurationDays(7, this)">
                7 Days (Full Week)
              </button>
              <button type="button" class="duration-pill ${this.selectedDurationDays === 10 ? 'active' : ''}" onclick="CreateTripView.setDurationDays(10, this)">
                10 Days (Explorer)
              </button>
              <button type="button" class="duration-pill ${this.selectedDurationDays === 14 ? 'active' : ''}" onclick="CreateTripView.setDurationDays(14, this)">
                14 Days (Grand Tour)
              </button>
            </div>
          </div>

          <!-- Date Range (Synced with Duration) -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="trip-start-date">Start Date <span class="required">*</span></label>
              <input type="date" id="trip-start-date" class="form-control" required value="${defaultStart}" onchange="CreateTripView.handleStartDateChange()" />
              <div class="form-error hidden" id="trip-start-date-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label" for="trip-end-date">End Date <span class="required">*</span></label>
              <input type="date" id="trip-end-date" class="form-control" required value="${defaultEnd}" onchange="CreateTripView.handleEndDateChange()" />
              <div class="form-error hidden" id="trip-end-date-error"></div>
            </div>
          </div>

          <!-- Budget & Currency -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="trip-budget">Estimated Budget</label>
              <input type="number" id="trip-budget" class="form-control" placeholder="2000" min="0" step="50" value="${budget}" />
              <div class="form-hint">Auto-calculated based on destination average costs & duration.</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="trip-currency">Currency</label>
              <select id="trip-currency" class="form-control">
                ${CONFIG.CURRENCIES.map(c => `
                  <option value="${c.code}" ${c.code === (AppStore.user.homeCurrency || 'USD') ? 'selected' : ''}>
                    ${c.name} (${c.symbol})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Auto-Generate Option Toggle -->
          <div class="form-group" style="padding: 1rem 1.25rem; background: var(--surface-2); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
            <label class="flex items-center gap-3" style="cursor: pointer;">
              <input type="checkbox" id="trip-autogenerate" checked style="width: 18px; height: 18px; accent-color: var(--primary-500); cursor: pointer;" />
              <div>
                <strong style="color: var(--text-main); font-size: 0.95rem;">✨ Auto-Generate Day-by-Day Itinerary (Recommended)</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                  Automatically crafts complete day schedules with curated photos, times (morning, afternoon, evening), authentic locations, and estimated costs.
                </div>
              </div>
            </label>
          </div>

          <!-- Travel Tags -->
          <div class="form-group">
            <label class="form-label">Travel Style & Preferences</label>
            <div class="flex items-center gap-2" style="flex-wrap: wrap; margin-top: 0.25rem;">
              ${availableTags.map(tag => `
                <button type="button" class="filter-pill ${this.selectedTags.includes(tag) ? 'active' : ''}" 
                  onclick="CreateTripView.toggleTag('${tag}', this)">
                  #${tag}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Cover Image Section -->
          <div class="form-group">
            <label class="form-label">Trip Cover Photo</label>
            <div class="cover-picker-grid" id="cover-presets-container">
              ${CONFIG.COVER_PRESETS.map(preset => `
                <img src="${preset.url}" alt="${preset.title}" 
                  class="cover-preset-thumb ${preset.url === this.selectedCoverUrl ? 'selected' : ''}" 
                  title="${preset.title}"
                  onclick="CreateTripView.selectPresetCover('${preset.url}', this)" />
              `).join('')}
            </div>

            <div style="margin-top: 1rem;">
              <div class="file-dropzone" onclick="document.getElementById('trip-cover-file').click()">
                <input type="file" id="trip-cover-file" accept="image/*" class="hidden" onchange="CreateTripView.handleFileUpload(event)" />
                <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">📸</div>
                <div class="font-semibold" style="font-size: 0.9rem;">Upload Custom Cover Photo</div>
                <div style="font-size: 0.75rem; color: var(--text-subtle);">Supports JPG, PNG, WebP (Strict 10MB limit)</div>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex items-center justify-between" style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--glass-border); flex-wrap: wrap; gap: 1rem;">
            <button type="button" class="btn btn-ghost" onclick="AppRouter.navigate('dashboard')">
              Cancel
            </button>
            <button type="submit" id="btn-create-trip-submit" class="btn btn-primary btn-lg">
              <span>🚀</span> Auto-Generate & Review Itinerary
            </button>
          </div>
        </form>
      </div>
    `;
  },

  selectDestinationPreset(destId, cardElement) {
    const dest = CONFIG.DESTINATIONS.find(d => d.id === destId);
    if (!dest) return;

    this.selectedDestinationId = destId;
    document.querySelectorAll('.dest-quick-card').forEach(el => el.classList.remove('selected'));
    cardElement.classList.add('selected');

    const destInput = document.getElementById('trip-destination');
    const titleInput = document.getElementById('trip-title');
    const budgetInput = document.getElementById('trip-budget');

    const destStr = `${dest.name}, ${dest.country}`;
    if (destInput) destInput.value = destStr;
    if (titleInput) titleInput.value = `${this.selectedDurationDays} Days in ${dest.name}`;
    if (budgetInput) budgetInput.value = dest.avgDailyCost * this.selectedDurationDays;

    this.selectedCoverUrl = dest.image;
    document.querySelectorAll('.cover-preset-thumb').forEach(el => el.classList.remove('selected'));
  },

  handleDestinationInput(val) {
    const titleInput = document.getElementById('trip-title');
    if (titleInput && val.trim()) {
      titleInput.value = `${this.selectedDurationDays} Days in ${val.trim()}`;
    }
  },

  setDurationDays(numDays, pillElement = null) {
    this.selectedDurationDays = Math.max(1, Math.min(30, numDays));
    
    // Update Stepper & Summary text
    const stepperVal = document.getElementById('duration-stepper-display');
    const summaryText = document.getElementById('duration-summary-text');
    if (stepperVal) stepperVal.innerText = `${this.selectedDurationDays} Days`;
    if (summaryText) summaryText.innerText = `Planning a ${this.selectedDurationDays}-day itinerary`;

    // Update Pills
    document.querySelectorAll('.duration-pill').forEach(el => el.classList.remove('active'));
    if (pillElement) {
      pillElement.classList.add('active');
    }

    // Sync End Date
    const startInput = document.getElementById('trip-start-date');
    const endInput = document.getElementById('trip-end-date');
    if (startInput && endInput && startInput.value) {
      const start = new Date(startInput.value);
      const end = new Date(start);
      end.setDate(start.getDate() + (this.selectedDurationDays - 1));
      endInput.value = end.toISOString().split('T')[0];
    }

    // Recalculate title & budget
    const destInput = document.getElementById('trip-destination');
    const titleInput = document.getElementById('trip-title');
    const budgetInput = document.getElementById('trip-budget');
    if (destInput && titleInput && destInput.value) {
      titleInput.value = `${this.selectedDurationDays} Days in ${destInput.value}`;
    }
    if (budgetInput) {
      budgetInput.value = this.selectedDurationDays * 180;
    }
  },

  adjustDuration(delta) {
    this.setDurationDays(this.selectedDurationDays + delta);
  },

  handleStartDateChange() {
    const startInput = document.getElementById('trip-start-date');
    const endInput = document.getElementById('trip-end-date');
    if (!startInput || !endInput) return;

    if (startInput.value) {
      const start = new Date(startInput.value);
      const end = new Date(start);
      end.setDate(start.getDate() + (this.selectedDurationDays - 1));
      endInput.value = end.toISOString().split('T')[0];
    }
  },

  handleEndDateChange() {
    const startInput = document.getElementById('trip-start-date');
    const endInput = document.getElementById('trip-end-date');
    if (!startInput || !endInput || !startInput.value || !endInput.value) return;

    const start = new Date(startInput.value);
    const end = new Date(endInput.value);
    if (end >= start) {
      const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      this.selectedDurationDays = diff;
      const stepperVal = document.getElementById('duration-stepper-display');
      const summaryText = document.getElementById('duration-summary-text');
      if (stepperVal) stepperVal.innerText = `${this.selectedDurationDays} Days`;
      if (summaryText) summaryText.innerText = `Planning a ${this.selectedDurationDays}-day itinerary`;
      document.querySelectorAll('.duration-pill').forEach(el => el.classList.remove('active'));
    }
  },

  selectPresetCover(url, element) {
    this.selectedCoverUrl = url;
    document.querySelectorAll('.cover-preset-thumb').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
  },

  async handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const dataUrl = await Utils.validateImageFile(file, 10);
      this.selectedCoverUrl = dataUrl;
      document.querySelectorAll('.cover-preset-thumb').forEach(el => el.classList.remove('selected'));
      Utils.showToast(`Custom cover image loaded (${(file.size / 1024 / 1024).toFixed(2)} MB)!`, 'success');
    } catch (err) {
      Utils.showToast(err.message, 'error', 'File Upload Error');
      event.target.value = '';
    }
  },

  toggleTag(tag, element) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
      element.classList.remove('active');
    } else {
      this.selectedTags.push(tag);
      element.classList.add('active');
    }
  },

  validateDates() {
    const startInput = document.getElementById('trip-start-date');
    const endInput = document.getElementById('trip-end-date');
    if (!startInput || !endInput) return true;

    const startDate = startInput.value;
    const endDate = endInput.value;
    let isValid = true;

    if (startDate && endDate && endDate < startDate) {
      endInput.classList.add('is-invalid');
      Utils.showToast('End Date cannot be before the Start Date.', 'error');
      isValid = false;
    } else {
      endInput.classList.remove('is-invalid');
    }

    return isValid;
  },

  async handleSubmit(event) {
    event.preventDefault();
    if (!this.validateDates()) return;

    const btn = document.getElementById('btn-create-trip-submit');
    const title = document.getElementById('trip-title').value.trim();
    const destination = document.getElementById('trip-destination').value.trim();
    const startDate = document.getElementById('trip-start-date').value;
    const endDate = document.getElementById('trip-end-date').value;
    const budget = document.getElementById('trip-budget').value;
    const currency = document.getElementById('trip-currency').value;
    const autoGenerate = document.getElementById('trip-autogenerate')?.checked !== false;

    if (!title || !destination || !startDate || !endDate) {
      Utils.showToast('Please fill out all required fields.', 'error');
      return;
    }

    btn.classList.add('btn-loading');
    try {
      const response = await MockApi.createTrip({
        title,
        destination,
        startDate,
        endDate,
        budget,
        currency,
        coverImage: this.selectedCoverUrl,
        tags: this.selectedTags,
        autoGenerate: autoGenerate,
        durationDays: this.selectedDurationDays
      });

      const trip = response.data;
      Utils.showToast(`✨ ${trip.days.length}-Day Itinerary for "${trip.destination}" auto-generated!`, 'success');
      AppRouter.navigate('itinerary-view', trip.id);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to create trip.', 'error');
    } finally {
      btn.classList.remove('btn-loading');
    }
  }
};
