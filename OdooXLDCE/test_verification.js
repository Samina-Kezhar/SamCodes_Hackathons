// Node.js Automated Test Suite for GlobeTrotter Core Engine

// 1. Mock Browser Environment
global.window = {};
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = String(val); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

// 2. Load Modules
const fs = require('fs');
const vm = require('vm');

function loadScript(filepath) {
  const code = fs.readFileSync(filepath, 'utf8');
  vm.runInThisContext(code);
}

loadScript('./js/config.js');
loadScript('./js/utils.js');
loadScript('./js/state.js');
loadScript('./js/api.js');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('--- STARTING GLOBETROTTER VERIFICATION SUITE ---\n');

  // Test 1: Config Data Integrity
  assert(CONFIG.DESTINATIONS.length >= 10, `Curated destinations loaded (${CONFIG.DESTINATIONS.length} found)`);
  assert(CONFIG.ACTIVITIES_CATALOG.length >= 20, `Activities catalog loaded (${CONFIG.ACTIVITIES_CATALOG.length} found)`);
  assert(CONFIG.CATEGORIES.length === 8, `8 travel categories configured`);

  // Test 2: First-visit User State Guard
  localStorage.clear();
  AppStore.user = AppStore.loadUser();
  assert(AppStore.user.isLoggedIn === false, 'User is logged out by default on first visit (Auth Guard)');

  // Test 3: Sign In / Demo Login
  const loginRes = await MockApi.login('alex.river@globetrotter.io', 'DemoPass123!');
  assert(loginRes.status === 200 && AppStore.user.isLoggedIn === true, 'User successfully authenticated');
  assert(AppStore.user.name === 'Alex River', 'User profile correctly formatted');

  // Test 4: Auto-Generate 5-Day Itinerary for Tokyo
  const trip5Days = await MockApi.createTrip({
    title: '5 Days in Tokyo, Japan',
    destination: 'Tokyo, Japan',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    budget: 900,
    currency: 'USD',
    autoGenerate: true
  });

  assert(trip5Days.status === 201, '5-Day Tokyo trip created');
  assert(trip5Days.data.days.length === 5, `Generated exactly 5 days (received ${trip5Days.data.days.length})`);
  
  let allActivitiesHaveDetails = true;
  trip5Days.data.days.forEach(day => {
    assert(day.activities.length >= 2, `Day ${day.dayNumber} has ${day.activities.length} scheduled activities`);
    day.activities.forEach(act => {
      if (!act.name || !act.image || !act.location || !act.startTime || !act.endTime || !act.category) {
        allActivitiesHaveDetails = false;
        console.error('Incomplete activity:', act);
      }
    });
  });
  assert(allActivitiesHaveDetails, 'Every activity in Tokyo itinerary contains image, time slot, location, title, and category');

  // Test 5: Auto-Generate 7-Day Itinerary for Custom Destination (Reykjavik, Iceland)
  const customTrip = await MockApi.createTrip({
    title: '7 Days in Reykjavik, Iceland',
    destination: 'Reykjavik, Iceland',
    startDate: '2026-10-01',
    endDate: '2026-10-07',
    budget: 1400,
    currency: 'USD',
    autoGenerate: true
  });

  assert(customTrip.data.days.length === 7, `Generated exactly 7 days for custom destination`);
  assert(customTrip.data.days[0].activities[0].location.includes('Reykjavik'), 'Custom destination activities contextualized to Reykjavik');

  // Test 6: Duration Adjustment (Extend from 5 to 7 days)
  const extendedTrip = await MockApi.updateTrip(trip5Days.data.id, {
    startDate: '2026-09-01',
    endDate: '2026-09-07'
  });
  assert(extendedTrip.data.days.length === 7, `Extended trip now contains 7 days (received ${extendedTrip.data.days.length})`);
  assert(extendedTrip.data.days[6].activities.length > 0, 'Extended days automatically populated with scheduled activities');

  // Test 7: Conflict Detection Algorithm
  const testActivities = [
    { id: '1', name: 'Morning Tour', startTime: '09:00', endTime: '11:00' },
    { id: '2', name: 'Lunch Tasting', startTime: '10:30', endTime: '12:00' }, // Overlaps with #1
    { id: '3', name: 'Evening Walk', startTime: '18:00', endTime: '20:00' }
  ];
  const conflictResult = Utils.detectActivityConflicts(testActivities);
  assert(conflictResult.hasConflict === true, 'Conflict detector identifies overlapping activity times');
  assert(conflictResult.conflictingIds.has('1') && conflictResult.conflictingIds.has('2'), 'Correct overlapping IDs flagged');

  // Test 8: Activity CRUD
  const newAct = await MockApi.addActivity(trip5Days.data.id, 1, {
    name: 'Asakusa Rickshaw Ride',
    category: 'adventure',
    cost: 40,
    startTime: '16:00',
    endTime: '17:00',
    location: 'Asakusa, Tokyo'
  });
  assert(newAct.status === 201 && newAct.data.name === 'Asakusa Rickshaw Ride', 'Added custom activity to Day 1');

  await MockApi.deleteActivity(trip5Days.data.id, 1, newAct.data.id);
  const reloaded = await MockApi.getTripById(trip5Days.data.id);
  const foundDeleted = reloaded.data.days[0].activities.find(a => a.id === newAct.data.id);
  assert(!foundDeleted, 'Successfully deleted activity from itinerary');

  // Test 9: Sign Out
  AppStore.signOut();
  assert(AppStore.user.isLoggedIn === false, 'User signed out and state updated');

  console.log(`\n--- TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED ---`);
  if (failedTests > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
