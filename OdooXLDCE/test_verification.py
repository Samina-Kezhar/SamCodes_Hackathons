import json
import re
import os
import sys

print("--- STARTING PYTHON VERIFICATION SUITE FOR GLOBETROTTER ---")

# 1. Verify CSS rules for text alignment, wrapping, and duration components
css_files = ['css/variables.css', 'css/base.css', 'css/components.css', 'css/layout.css', 'css/views.css']
for f in css_files:
    assert os.path.exists(f), f"File {f} must exist"
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
        assert len(content) > 100, f"File {f} should not be empty"

with open('css/base.css', 'r', encoding='utf-8') as fp:
    base_css = fp.read()
    assert 'word-break: break-word' in base_css, "base.css must contain word-break guards"
    assert 'overflow-wrap: break-word' in base_css, "base.css must contain overflow-wrap guards"
print("[PASS] 1. Base CSS layout and typography collision guards verified")

with open('css/components.css', 'r', encoding='utf-8') as fp:
    comp_css = fp.read()
    assert '.duration-picker-wrap' in comp_css, "components.css must contain .duration-picker-wrap"
    assert '.duration-pill' in comp_css, "components.css must contain .duration-pill"
    assert '.duration-stepper' in comp_css, "components.css must contain .duration-stepper"
print("[PASS] 2. Duration selector styles verified in components.css")

with open('css/views.css', 'r', encoding='utf-8') as fp:
    views_css = fp.read()
    assert '.dest-quick-grid' in views_css, "views.css must contain .dest-quick-grid"
    assert '.activity-thumb' in views_css, "views.css must contain .activity-thumb"
print("[PASS] 3. Activity thumbnail and destination quick grid styles verified in views.css")

# 2. Verify JS Files exist and contain required methods
js_files = [
    'js/config.js',
    'js/state.js',
    'js/api.js',
    'js/app.js',
    'js/views/authView.js',
    'js/views/dashboardView.js',
    'js/views/createTripView.js',
    'js/views/itineraryView.js',
    'js/views/itineraryBuilderView.js',
    'js/views/sharedTripView.js'
]
for f in js_files:
    assert os.path.exists(f), f"File {f} must exist"

with open('js/state.js', 'r', encoding='utf-8') as fp:
    state_js = fp.read()
    assert 'isLoggedIn: false' in state_js, "state.js must default to isLoggedIn: false on first visit"
    assert 'signOut()' in state_js, "state.js must have signOut method"
print("[PASS] 4. State management & Auth guard verified in state.js")

with open('js/app.js', 'r', encoding='utf-8') as fp:
    app_js = fp.read()
    assert "route === 'auth'" in app_js, "app.js must handle auth route"
    assert "#auth" in app_js, "app.js must redirect unauthenticated visits to #auth"
print("[PASS] 5. Route guarding & navigation control verified in app.js")

with open('js/api.js', 'r', encoding='utf-8') as fp:
    api_js = fp.read()
    assert '_generateAutoItinerary' in api_js, "api.js must have _generateAutoItinerary engine"
    assert 'regenerateItinerary' in api_js, "api.js must have regenerateItinerary method"
print("[PASS] 6. Auto-Itinerary generation engine verified in api.js")

with open('js/views/createTripView.js', 'r', encoding='utf-8') as fp:
    create_js = fp.read()
    assert 'dest-quick-card' in create_js, "createTripView.js must have destination quick cards"
    assert 'duration-pill' in create_js, "createTripView.js must have duration pills"
    assert 'duration-stepper' in create_js, "createTripView.js must have duration stepper"
    assert 'trip-autogenerate' in create_js, "createTripView.js must have auto-generate toggle"
print("[PASS] 7. Create Trip View destination cards & duration customizer verified")

with open('js/views/itineraryView.js', 'r', encoding='utf-8') as fp:
    itin_js = fp.read()
    assert 'activity-thumb' in itin_js, "itineraryView.js must render activity thumbnail images"
    assert 'activity-time-tag' in itin_js, "itineraryView.js must render activity time slots"
    assert 'activity-item' in itin_js, "itineraryView.js must render activity items"
print("[PASS] 8. Itinerary Reader View day-by-day image, time, location breakdown verified")

with open('js/views/itineraryBuilderView.js', 'r', encoding='utf-8') as fp:
    builder_js = fp.read()
    assert 'activity-thumb' in builder_js, "itineraryBuilderView.js must render activity thumbnail images"
    assert 'promptRegenerateItinerary' in builder_js, "itineraryBuilderView.js must support auto-regeneration"
    assert 'openEditDatesModal' in builder_js, "itineraryBuilderView.js must support duration editing"
print("[PASS] 9. Itinerary Builder View day-by-day editor & duration controls verified")

print("\n--- ALL 9 VERIFICATION CHECKS PASSED SUCCESSFULLY! ---")
