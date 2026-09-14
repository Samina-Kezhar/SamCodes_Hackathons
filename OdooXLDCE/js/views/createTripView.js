/**
 * Screen 3: Create / Auto-Generate Trip View
 * Handles destination selection (country or city), stay duration customization (number of days),
 * budget tracking, synchronized travel dates, and live-renders the day-by-day boxed itinerary section.
 */

const CreateTripView = {
  selectedCoverUrl: CONFIG.COVER_PRESETS[0].url,
  selectedTags: ['Culture', 'Adventure'],
  currentDuration: 5,
  autoGenerateEnabled: true,
  previewDebounceTimer: null,

  popularDestinations: [
    { name: 'Goa', type: 'city', flag: '🏖️', cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', currency: 'INR', dailyEst: 3500 },
    { name: 'Dubai', type: 'city', flag: '🏙️', cover: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', currency: 'USD', dailyEst: 260 },
    { name: 'Tokyo', type: 'city', flag: '⛩️', cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', currency: 'JPY', dailyEst: 22000 },
    { name: 'Paris', type: 'city', flag: '🗼', cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', currency: 'EUR', dailyEst: 180 },
    { name: 'Manali', type: 'city', flag: '🏔️', cover: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', currency: 'INR', dailyEst: 2800 },
    { name: 'Jaipur', type: 'city', flag: '🏰', cover: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80', currency: 'INR', dailyEst: 2600 },
    { name: 'Kerala', type: 'city', flag: '🌴', cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', currency: 'INR', dailyEst: 3000 },
    { name: 'Bali', type: 'city', flag: '🌺', cover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', currency: 'USD', dailyEst: 140 },
    { name: 'Rome', type: 'city', flag: '🏛️', cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', currency: 'EUR', dailyEst: 170 },
    { name: 'London', type: 'city', flag: '🎡', cover: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', currency: 'GBP', dailyEst: 190 },
    { name: 'Singapore', type: 'city', flag: '🦁', cover: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', currency: 'USD', dailyEst: 195 },
    { name: 'Switzerland', type: 'country', flag: '🇨🇭', cover: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', currency: 'CHF', dailyEst: 230 },
    { name: 'New York City', type: 'city', flag: '🗽', cover: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', currency: 'USD', dailyEst: 220 },
    { name: 'Japan', type: 'country', flag: '🇯🇵', cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', currency: 'JPY', dailyEst: 24000 },
    { name: 'France', type: 'country', flag: '🇫🇷', cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', currency: 'EUR', dailyEst: 190 },
    { name: 'Italy', type: 'country', flag: '🇮🇹', cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', currency: 'EUR', dailyEst: 175 }
  ],

  formatDateInput(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  parseDateInput(str) {
    if (!str) return new Date();
    const parts = str.split('-').map(Number);
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
  },

  render(prefillData = null) {
    const container = document.getElementById('view-container');
    if (!container) return;

    this.currentDuration = prefillData?.duration || 5;
    
    // Default start date = tomorrow in local timezone
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const endDate = new Date(tomorrow);
    endDate.setDate(tomorrow.getDate() + this.currentDuration - 1);

    const defaultStart = this.formatDateInput(tomorrow);
    const defaultEnd = this.formatDateInput(endDate);

    const destination = prefillData?.destination || 'Goa';
    const title = prefillData?.title || `${this.currentDuration}-Day Adventure in ${destination}`;
    const budget = prefillData?.budget || 15000;
    this.selectedCoverUrl = prefillData?.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80';

    const availableTags = ['Culture', 'Adventure', 'Foodie', 'Relax', 'Luxury', 'Budget', 'Solo', 'Family'];

    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 960px; margin: 0 auto; padding-bottom: 3rem;">
        <!-- Page Header -->
        <div class="flex items-center justify-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="badge badge-primary" style="margin-bottom: 0.5rem;">✨ Smart Itinerary Planner</div>
            <h1>Plan & <span class="text-gradient">Auto-Generate Journey</span></h1>
            <p>Choose your trip destination, stay duration & budget to instantly generate a day-by-day boxed itinerary.</p>
          </div>
          <button class="btn btn-secondary" onclick="AppRouter.navigate('dashboard')">
            &larr; Back to Dashboard
          </button>
        </div>

        <form id="form-create-trip" class="glass-card" onsubmit="CreateTripView.handleSubmit(event)" style="box-shadow: var(--shadow-lg); padding: 2rem;">
          
          <!-- Step 1: Destination Quick Selection -->
          <div class="form-group" style="margin-bottom: 1.75rem;">
            <label class="form-label" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
              <span class="font-bold" style="font-size: 1.05rem;">📍 1. Choose a Place for the Trip <span class="required">*</span></span>
              <span style="font-size: 0.8rem; color: var(--accent-cyan);">Click any quick spot or type below</span>
            </label>
            
            <div class="flex items-center gap-2" style="flex-wrap: wrap; margin-bottom: 1rem;" id="popular-dest-pills">
              ${this.popularDestinations.map(p => `
                <button type="button" class="filter-pill ${destination.toLowerCase().includes(p.name.toLowerCase()) ? 'active' : ''}"
                  onclick="CreateTripView.selectPopularDestination('${p.name}', '${p.type}', '${p.cover}', '${p.currency}', ${p.dailyEst}, this)">
                  <span>${p.flag}</span>
                  <span>${p.name}</span>
                  <span style="font-size: 0.65rem; opacity: 0.75; text-transform: uppercase;">(${p.type})</span>
                </button>
              `).join('')}
            </div>

            <!-- Destination & Title Inputs -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="trip-destination">Destination Name <span class="required">*</span></label>
                <input type="text" id="trip-destination" class="form-control" placeholder="e.g. Goa, Dubai, Paris, Tokyo, Bali, Manali, Rome, Spain, Japan, France..." required 
                  value="${Utils.escapeHtml(destination)}" oninput="CreateTripView.handleDestinationInput(this.value)" />
                <div class="form-hint">Type any city or country worldwide for auto-curated spot sights.</div>
              </div>

              <div class="form-group">
                <label class="form-label" for="trip-title">Trip Title <span class="required">*</span></label>
                <input type="text" id="trip-title" class="form-control" placeholder="e.g. 5-Day Goa Coastal Explorer" required 
                  value="${Utils.escapeHtml(title)}" />
              </div>
            </div>

            <!-- Optional Trip Description -->
            <div class="form-group" style="margin-top: 1rem;">
              <label class="form-label" for="trip-description">Trip Description / Overview</label>
              <textarea id="trip-description" class="form-control" placeholder="Describe the purpose, highlights, or traveler vibe of this journey..." style="min-height: 72px;">${Utils.escapeHtml(prefillData?.description || '')}</textarea>
              <div class="form-hint">Optional notes or overview for this multi-day adventure.</div>
            </div>
          </div>

          <!-- Step 2: Stay Duration & Target Budget -->
          <div class="form-group" style="background: var(--surface-2); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border); margin-bottom: 1.75rem;">
            <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
              <label class="form-label" style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 0; font-weight: 700;">
                ⏱️ 2. Stay Duration & Budget Planning <span class="required">*</span>
              </label>
              <span class="badge badge-emerald" id="duration-badge-display">${this.currentDuration} Days Stay</span>
            </div>
            <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 1rem;">
              Selecting stay days automatically adjusts the start & end dates, scales the itinerary, and calculates the target budget.
            </p>

            <!-- Duration Selector (Stepper + Slider + Pills) -->
            <div class="flex items-center gap-4" style="flex-wrap: wrap; margin-bottom: 1.25rem;">
              <!-- Stepper Control -->
              <div class="flex items-center gap-2" style="background: var(--surface-1); padding: 5px 10px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
                <button type="button" class="btn btn-secondary btn-sm" onclick="CreateTripView.changeDuration(-1)" style="padding: 6px 12px; font-weight: bold;">-</button>
                <span id="stepper-duration-value" style="font-family: var(--font-mono); font-weight: 700; font-size: 1.1rem; min-width: 5rem; text-align: center; color: var(--accent-cyan);">
                  ${this.currentDuration} Days
                </span>
                <button type="button" class="btn btn-secondary btn-sm" onclick="CreateTripView.changeDuration(1)" style="padding: 6px 12px; font-weight: bold;">+</button>
              </div>

              <!-- Interactive Duration Slider -->
              <div class="flex items-center gap-2" style="flex: 1 1 200px; min-width: 180px; background: var(--surface-1); padding: 6px 14px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
                <span style="font-size: 0.75rem; color: var(--text-subtle);">1d</span>
                <input type="range" id="duration-range-slider" min="1" max="30" value="${this.currentDuration}" 
                  style="flex: 1; accent-color: var(--primary-500); cursor: pointer;"
                  oninput="CreateTripView.setDuration(parseInt(this.value, 10))" />
                <span style="font-size: 0.75rem; color: var(--text-subtle);">30d</span>
              </div>

              <!-- Quick Duration Pills -->
              <div class="flex items-center gap-2" style="flex-wrap: wrap;" id="quick-duration-pills">
                ${[2, 3, 4, 5, 7, 10, 14].map(d => `
                  <button type="button" class="filter-pill ${d === this.currentDuration ? 'active' : ''}" 
                    onclick="CreateTripView.setDuration(${d})">
                    ${d} Days
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Start Date & End Date (Synchronized) -->
            <div class="form-row" style="margin-bottom: 1.25rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="trip-start-date" style="font-size: 0.85rem; font-weight: 600;">
                  📅 Trip Start Date <span class="required">*</span>
                </label>
                <input type="date" id="trip-start-date" class="form-control" required value="${defaultStart}" 
                  onchange="CreateTripView.handleStartDateChange(this.value)" />
                <div class="form-hint">Arrival date at destination</div>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="trip-end-date" style="font-size: 0.85rem; font-weight: 600;">
                  📅 Trip End Date <span class="required">*</span>
                </label>
                <input type="date" id="trip-end-date" class="form-control" required value="${defaultEnd}" 
                  onchange="CreateTripView.handleEndDateChange(this.value)" />
                <div class="form-hint">Automatically synced to duration</div>
              </div>
            </div>

            <!-- Budget & Currency -->
            <div class="form-row" style="margin-bottom: 0;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="trip-budget" style="font-size: 0.85rem; font-weight: 600;">
                  💰 Total Target Budget
                </label>
                <input type="number" id="trip-budget" class="form-control" placeholder="15000" min="0" step="50" 
                  value="${budget}" oninput="CreateTripView.handleBudgetInput(this.value)" />
                <div class="form-hint">Estimated spending ceiling for total trip duration.</div>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="trip-currency" style="font-size: 0.85rem; font-weight: 600;">
                  💱 Preferred Currency
                </label>
                <select id="trip-currency" class="form-control" onchange="CreateTripView.handleCurrencyChange(this.value)">
                  ${CONFIG.CURRENCIES.map(c => `
                    <option value="${c.code}" ${c.code === (destination === 'Goa' || destination === 'Manali' || destination === 'Jaipur' || destination === 'Kerala' ? 'INR' : (AppStore.user.homeCurrency || 'USD')) ? 'selected' : ''}>
                      ${c.name} (${c.symbol})
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Travel Style Tags -->
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label" style="font-weight: 600;">Trip Style & Tags</label>
            <div class="flex items-center gap-2" style="flex-wrap: wrap; margin-top: 0.25rem;">
              ${availableTags.map(tag => `
                <button type="button" class="filter-pill ${this.selectedTags.includes(tag) ? 'active' : ''}" 
                  onclick="CreateTripView.toggleTag('${tag}', this)">
                  #${tag}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Cover Image Option (Optional) -->
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600;">Trip Cover Photo (Optional)</span>
              <span style="font-size: 0.75rem; color: var(--text-subtle);">Upload or choose preset</span>
            </label>

            <div class="flex items-center gap-3" style="margin-bottom: 0.75rem; flex-wrap: wrap;">
              <input type="file" id="trip-cover-file" accept="image/*" style="display: none;" onchange="CreateTripView.handleFileUpload(event)" />
              <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('trip-cover-file').click()">
                <span>📷</span> Upload Custom Photo
              </button>
              <div style="flex: 1; min-width: 220px;">
                <input type="url" id="trip-cover-custom-url" class="form-control" placeholder="Or paste image URL (https://...)" oninput="CreateTripView.handleCustomUrl(this.value)" />
              </div>
            </div>

            <!-- Active Cover Preview -->
            <div id="cover-active-preview-box" style="margin-bottom: 0.75rem; position: relative; border-radius: var(--radius-sm); overflow: hidden; height: 120px; border: 1px solid var(--glass-border);">
              <img id="cover-active-preview-img" src="${this.selectedCoverUrl}" alt="Cover Preview" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); padding: 3px 10px; border-radius: 4px; font-size: 0.75rem; color: #fff;">Selected Cover Photo</div>
            </div>
          </div>

          <!-- Live Boxed Itinerary Section Preview (Day 1 in Box 1, Day 2 in Box 2) -->
          <div id="itinerary-live-preview-box">
            <!-- Rendered dynamically by renderItinerarySectionPreview -->
          </div>

          <!-- Submit Buttons -->
          <div class="flex items-center justify-between" style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--glass-border); flex-wrap: wrap; gap: 1rem;">
            <button type="button" class="btn btn-ghost" onclick="AppRouter.navigate('dashboard')">
              Cancel
            </button>
            <button type="submit" id="btn-create-trip-submit" class="btn btn-primary btn-lg">
              <span id="submit-btn-icon">🚀</span>
              <span id="submit-btn-text">Save & Open Full Itinerary (${this.currentDuration} Days)</span>
            </button>
          </div>
        </form>
      </div>
    `;

    // Render the initial boxed itinerary preview
    requestAnimationFrame(() => {
      this.renderItinerarySectionPreview();
    });
  },

  selectPopularDestination(destName, type, coverUrl, currency, dailyEst, element) {
    document.querySelectorAll('#popular-dest-pills .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.innerText.includes(destName));
    });

    const destInput = document.getElementById('trip-destination');
    const titleInput = document.getElementById('trip-title');
    const currencySelect = document.getElementById('trip-currency');
    const budgetInput = document.getElementById('trip-budget');

    if (destInput) destInput.value = destName;
    if (titleInput) titleInput.value = `${this.currentDuration}-Day ${destName} ${type === 'country' ? 'Expedition' : 'Getaway'}`;
    if (currencySelect && currency) currencySelect.value = currency;

    if (coverUrl) {
      this.selectedCoverUrl = coverUrl;
      const previewImg = document.getElementById('cover-active-preview-img');
      if (previewImg) previewImg.src = coverUrl;
    }

    // Auto-calculate budget based on daily estimate
    if (budgetInput) {
      const estimate = dailyEst || (currency === 'INR' ? 3000 : currency === 'JPY' ? 22000 : 180);
      budgetInput.value = Math.round(this.currentDuration * estimate);
    }

    // Ensure start and end dates are set
    const startInput = document.getElementById('trip-start-date');
    const endInput = document.getElementById('trip-end-date');
    if (startInput && endInput) {
      if (!startInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        startInput.value = this.formatDateInput(tomorrow);
      }
      const start = this.parseDateInput(startInput.value);
      const end = new Date(start);
      end.setDate(start.getDate() + this.currentDuration - 1);
      endInput.value = this.formatDateInput(end);
    }

    this.renderItinerarySectionPreview();
  },

  handleDestinationInput(value) {
    const titleInput = document.getElementById('trip-title');
    if (titleInput && value.trim()) {
      const formatted = (typeof Utils !== 'undefined' && typeof Utils.capitalize === 'function')
        ? Utils.capitalize(value.trim())
        : value.trim();
      titleInput.value = `${this.currentDuration}-Day Adventure in ${formatted}`;
    }
    clearTimeout(this.previewDebounceTimer);
    this.previewDebounceTimer = setTimeout(() => {
      this.renderItinerarySectionPreview();
    }, 400);
  },

  changeDuration(delta) {
    const newDuration = Math.max(1, Math.min(30, this.currentDuration + delta));
    this.setDuration(newDuration);
  },

  setDuration(days) {
    this.currentDuration = days;

    const stepperVal = document.getElementById('stepper-duration-value');
    const badgeDisp = document.getElementById('duration-badge-display');
    const submitBtnText = document.getElementById('submit-btn-text');
    const slider = document.getElementById('duration-range-slider');

    if (stepperVal) stepperVal.innerText = `${days} Days`;
    if (badgeDisp) badgeDisp.innerText = `${days} Days Stay`;
    if (slider && Number(slider.value) !== days) slider.value = days;
    if (submitBtnText) submitBtnText.innerText = `Save & Open Full Itinerary (${days} Days)`;

    // Update pills active state
    document.querySelectorAll('#quick-duration-pills .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.innerText.trim() === `${days} Days`);
    });

    // Update End Date
    const startInput = document.getElementById('trip-start-date');
    const endInput = document.getElementById('trip-end-date');
    if (startInput && endInput && startInput.value) {
      const start = this.parseDateInput(startInput.value);
      const end = new Date(start);
      end.setDate(start.getDate() + days - 1);
      endInput.value = this.formatDateInput(end);
    }

    // Auto-update trip title
    const dest = document.getElementById('trip-destination')?.value || 'Destination';
    const titleInput = document.getElementById('trip-title');
    if (titleInput) {
      titleInput.value = `${days}-Day Adventure in ${dest}`;
    }

    // Estimate budget
    const budgetInput = document.getElementById('trip-budget');
    const currency = document.getElementById('trip-currency')?.value || 'USD';
    if (budgetInput) {
      const dailyEst = currency === 'INR' ? 3000 : currency === 'JPY' ? 22000 : 180;
      budgetInput.value = Math.max(200, days * dailyEst);
    }

    this.renderItinerarySectionPreview();
  },

  handleStartDateChange(newStartDate) {
    if (!newStartDate) return;
    const start = this.parseDateInput(newStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + this.currentDuration - 1);
    
    const endInput = document.getElementById('trip-end-date');
    if (endInput) endInput.value = this.formatDateInput(end);
    this.renderItinerarySectionPreview();
  },

  handleEndDateChange(newEndDate) {
    const startInput = document.getElementById('trip-start-date');
    if (!startInput || !startInput.value || !newEndDate) return;

    const diff = Utils.daysBetween(startInput.value, newEndDate);
    if (diff > 0) {
      this.currentDuration = diff;
      const stepperVal = document.getElementById('stepper-duration-value');
      const badgeDisp = document.getElementById('duration-badge-display');
      const submitBtnText = document.getElementById('submit-btn-text');

      if (stepperVal) stepperVal.innerText = `${diff} Days`;
      if (badgeDisp) badgeDisp.innerText = `${diff} Days Stay`;
      if (submitBtnText) submitBtnText.innerText = `Save & Open Full Itinerary (${diff} Days)`;

      document.querySelectorAll('#quick-duration-pills .filter-pill').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.trim() === `${diff} Days`);
      });

      this.renderItinerarySectionPreview();
    }
  },

  handleBudgetInput(value) {
    clearTimeout(this.previewDebounceTimer);
    this.previewDebounceTimer = setTimeout(() => {
      this.renderItinerarySectionPreview();
    }, 400);
  },

  handleCurrencyChange(value) {
    this.renderItinerarySectionPreview();
  },

  handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      Utils.showToast('Selected image exceeds the 10MB limit. Please choose a smaller photo.', 'error');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      this.selectedCoverUrl = dataUrl;
      const previewImg = document.getElementById('cover-active-preview-img');
      if (previewImg) previewImg.src = dataUrl;
      Utils.showToast('Custom cover photo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  },

  handleCustomUrl(url) {
    const trimmed = url.trim();
    if (!trimmed) return;
    this.selectedCoverUrl = trimmed;
    const previewImg = document.getElementById('cover-active-preview-img');
    if (previewImg) previewImg.src = trimmed;
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

  /**
   * Real-Time Boxed Itinerary Section Preview
   * Automatically packages Day-1 in a distinct box, Day-2 in another box, etc.
   * with timings, budget, and authentic spot photos.
   */
  renderItinerarySectionPreview() {
    const previewBox = document.getElementById('itinerary-live-preview-box');
    if (!previewBox) return;

    const dest = document.getElementById('trip-destination')?.value.trim() || 'Goa';
    const startDate = document.getElementById('trip-start-date')?.value || this.formatDateInput(new Date());
    const duration = this.currentDuration;
    const currency = document.getElementById('trip-currency')?.value || 'USD';
    const userBudget = Number(document.getElementById('trip-budget')?.value) || 0;

    let generated;
    try {
      generated = ItineraryGenerator.generate(dest, duration, startDate);
    } catch (e) {
      console.warn('Preview generation error:', e);
      return;
    }

    const totalSpent = generated.days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0), 0);
    const displayBudget = userBudget > 0 ? userBudget : generated.budget;

    previewBox.innerHTML = `
      <div class="itinerary-preview-wrapper" style="margin-top: 2rem; border-top: 2px dashed var(--glass-border); padding-top: 1.75rem;">
        <div class="flex items-center justify-between" style="margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="flex items-center gap-2" style="margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span class="badge badge-primary">✨ Itinerary Section (Boxed)</span>
              <span class="badge badge-cyan">${duration} Days</span>
              <span class="badge badge-emerald">Budget: ${Utils.formatCurrency(displayBudget, currency)}</span>
            </div>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.25rem; color: var(--text-main);">
              Day-by-Day Itinerary for <span class="text-gradient">${Utils.escapeHtml(dest)}</span>
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              🗓️ ${Utils.formatDate(generated.startDate)} to ${Utils.formatDate(generated.endDate)} &bull; Each day arranged in an individual container box with timing, budget & photos.
            </p>
          </div>
        </div>

        <!-- Boxed Days Stream: Day-1 in Box 1, Day-2 in Box 2, etc. -->
        <div class="flex flex-col gap-6">
          ${generated.days.map((day, dayIndex) => {
            const dayCost = day.activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
            const borderColors = ['var(--primary-500)', 'var(--accent-cyan)', 'var(--accent-emerald)', 'var(--accent-amber)', 'var(--accent-rose)', '#a78bfa'];
            const activeColor = borderColors[dayIndex % borderColors.length];

            return `
              <div class="itinerary-day-box day-card" style="border-left: 5px solid ${activeColor}; background: var(--surface-1); border-radius: var(--radius-md); border-top: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); overflow: hidden; margin-bottom: 1.5rem; box-shadow: var(--shadow-md);">
                <!-- Day Header Inside the Box -->
                <div class="itinerary-day-box-header flex items-center justify-between" style="padding: 1rem 1.25rem; background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%); border-bottom: 1px solid var(--glass-border); flex-wrap: wrap; gap: 0.75rem;">
                  <div class="flex items-center gap-3">
                    <span class="day-number-badge" style="background: ${activeColor}; color: #fff; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-xs); font-size: 0.85rem; letter-spacing: 0.5px;">
                      Day ${day.dayNumber}
                    </span>
                    <div>
                      <h4 style="font-size: 1.05rem; margin-bottom: 2px; color: var(--text-main);">${Utils.escapeHtml(day.theme)}</h4>
                      <div class="flex items-center gap-3" style="font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
                        <span>🗓️ ${Utils.formatDate(day.date)}</span>
                        <span style="color: var(--accent-cyan);">📍 ${Utils.escapeHtml(day.city || dest)}</span>
                        <span>&bull; ${day.activities.length} spots planned</span>
                      </div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.75rem; color: var(--text-subtle);">Day Spend</div>
                    <span style="font-weight: 700; color: var(--accent-emerald); font-size: 1.05rem;">
                      ${Utils.formatCurrency(dayCost, currency)}
                    </span>
                  </div>
                </div>

                <!-- Activities List for this Day inside the Box -->
                <div class="flex flex-col gap-3" style="padding: 1.15rem;">
                  ${day.activities.map(act => {
                    const cat = CONFIG.CATEGORIES.find(c => c.id === act.category) || CONFIG.CATEGORIES[0];
                    const actImg = act.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80';

                    return `
                      <div class="activity-item" style="padding: 0.85rem 1rem;">
                        <!-- Spot Photo Thumbnail -->
                        <div class="activity-thumb-wrapper">
                          <img src="${actImg}" alt="${Utils.escapeHtml(act.name)}" class="activity-thumb-img"
                            onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'" />
                          <span class="activity-category-pill" title="${cat.name}">${cat.icon}</span>
                        </div>

                        <!-- Spot Details -->
                        <div class="activity-body">
                          <div class="activity-header-line">
                            <h5 class="activity-title">${Utils.escapeHtml(act.name)}</h5>
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

                        <!-- Timing & Cost Slot -->
                        <div class="activity-timing-col">
                          <div class="activity-time-tag">${act.startTime || '--:--'} - ${act.endTime || '--:--'}</div>
                          <div class="activity-cost-tag">${Utils.formatCurrency(act.cost, currency)}</div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  async handleSubmit(event) {
    event.preventDefault();

    const btn = document.getElementById('btn-create-trip-submit');
    const title = document.getElementById('trip-title').value.trim();
    const destination = document.getElementById('trip-destination').value.trim();
    const description = document.getElementById('trip-description')?.value.trim() || '';
    const startDate = document.getElementById('trip-start-date').value;
    const endDate = document.getElementById('trip-end-date').value;
    const budget = document.getElementById('trip-budget').value;
    const currency = document.getElementById('trip-currency').value;

    if (!title || !destination || !startDate || !endDate) {
      Utils.showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (endDate < startDate) {
      Utils.showToast('End date must be on or after the start date.', 'error');
      return;
    }

    btn.classList.add('btn-loading');
    Utils.showToast(`Synthesizing ${this.currentDuration}-day itinerary for ${destination}...`, 'info');

    try {
      const response = await MockApi.createTrip({
        title,
        destination,
        description,
        startDate,
        endDate,
        budget,
        currency,
        coverImage: this.selectedCoverUrl,
        tags: this.selectedTags,
        autoGenerate: true
      });

      Utils.showToast(`Trip "${response.data.title}" successfully created!`, 'success');
      AppRouter.navigate('itinerary-view', response.data.id);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to create trip.', 'error');
    } finally {
      btn.classList.remove('btn-loading');
    }
  }
};
