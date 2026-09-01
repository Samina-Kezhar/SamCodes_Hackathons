/**
 * GlobeTrotter App Configuration & Curated Travel Dataset
 * Curated destinations, multi-city activities, categories, currencies, and demo trip packages.
 */

const CONFIG = {
  APP_NAME: 'GlobeTrotter',
  VERSION: '2.0.0',
  STORAGE_KEY_TRIPS: 'globetrotter_trips_v2',
  STORAGE_KEY_USER: 'globetrotter_user_v2',
  STORAGE_KEY_SETTINGS: 'globetrotter_settings_v2',
  STORAGE_KEY_WISHLIST: 'globetrotter_wishlist_v2',
  API_DELAY_MS: 300, // Simulated network latency

  CURRENCIES: [
    { code: 'USD', symbol: '$', name: 'US Dollar (USD)', rate: 1.0 },
    { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rate: 0.92 },
    { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', rate: 0.79 },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', rate: 83.5 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', rate: 155.0 },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)', rate: 0.90 },
    { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', rate: 1.36 },
    { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar (AUD)', rate: 1.52 },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)', rate: 3.67 },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', rate: 1.35 }
  ],

  CATEGORIES: [
    { id: 'sightseeing', name: 'Sightseeing', icon: '🏛️', color: '#6366f1' },
    { id: 'food', name: 'Food & Dining', icon: '🍜', color: '#f97316' },
    { id: 'transport', name: 'Transport', icon: '🚆', color: '#06b6d4' },
    { id: 'stay', name: 'Stay & Lodging', icon: '🏨', color: '#10b981' },
    { id: 'adventure', name: 'Adventure & Nature', icon: '⛰️', color: '#ec4899' },
    { id: 'culture', name: 'Culture & Arts', icon: '🎭', color: '#8b5cf6' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#f59e0b' },
    { id: 'nightlife', name: 'Nightlife & Drinks', icon: '🍸', color: '#ef4444' }
  ],

  COVER_PRESETS: [
    { id: 'paris', title: 'Paris Romance', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
    { id: 'tokyo', title: 'Tokyo Neon & Temples', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
    { id: 'swiss', title: 'Swiss Alps', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' },
    { id: 'bali', title: 'Bali Tropical', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
    { id: 'rome', title: 'Rome Colosseum', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' },
    { id: 'nyc', title: 'New York Skyline', url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80' },
    { id: 'london', title: 'London Tower Bridge', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80' },
    { id: 'barcelona', title: 'Barcelona Sagrada', url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80' },
    { id: 'santorini', title: 'Santorini Blue', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kyoto', title: 'Kyoto Bamboo', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
    { id: 'sydney', title: 'Sydney Harbour', url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80' },
    { id: 'dubai', title: 'Dubai Burj Khalifa', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' }
  ],

  AVATAR_PRESETS: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
  ],

  DESTINATIONS: [
    {
      id: 'dest-paris',
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      costIndex: '$$$',
      popularity: 9.8,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'The City of Light, famous for world-class art, culinary wonders, and romantic avenues.',
      timeZone: 'Europe/Paris (GMT+2)',
      avgDailyCost: 180
    },
    {
      id: 'dest-tokyo',
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      costIndex: '$$$',
      popularity: 9.9,
      rating: 4.95,
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      description: 'A dazzling juxtaposition of ultra-modern neon skyscrapers and tranquil historic shrines.',
      timeZone: 'Asia/Tokyo (GMT+9)',
      avgDailyCost: 160
    },
    {
      id: 'dest-zurich',
      name: 'Zurich & Interlaken',
      country: 'Switzerland',
      region: 'Europe',
      costIndex: '$$$$',
      popularity: 9.5,
      rating: 4.85,
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      description: 'Majestic Alpine peaks, pristine turquoise lakes, and world-renowned scenic train journeys.',
      timeZone: 'Europe/Zurich (GMT+2)',
      avgDailyCost: 240
    },
    {
      id: 'dest-bali',
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      costIndex: '$',
      popularity: 9.6,
      rating: 4.88,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      description: 'Tropical paradise featuring lush rice terraces, sacred temples, surf beaches, and yoga retreats.',
      timeZone: 'Asia/Makassar (GMT+8)',
      avgDailyCost: 75
    },
    {
      id: 'dest-rome',
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      costIndex: '$$',
      popularity: 9.7,
      rating: 4.86,
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      description: 'The Eternal City with thousands of years of art, architecture, and mouth-watering trattorias.',
      timeZone: 'Europe/Rome (GMT+2)',
      avgDailyCost: 150
    },
    {
      id: 'dest-nyc',
      name: 'New York City',
      country: 'United States',
      region: 'Americas',
      costIndex: '$$$$',
      popularity: 9.8,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      description: 'Broadway, world-class dining, Central Park, and the electrifying energy of Manhattan.',
      timeZone: 'America/New_York (GMT-4)',
      avgDailyCost: 260
    },
    {
      id: 'dest-london',
      name: 'London',
      country: 'United Kingdom',
      region: 'Europe',
      costIndex: '$$$',
      popularity: 9.7,
      rating: 4.89,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      description: 'Historic royal palaces, world-class West End theatre, iconic double-decker buses, and bustling markets.',
      timeZone: 'Europe/London (GMT+1)',
      avgDailyCost: 200
    },
    {
      id: 'dest-barcelona',
      name: 'Barcelona',
      country: 'Spain',
      region: 'Europe',
      costIndex: '$$',
      popularity: 9.6,
      rating: 4.87,
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
      description: 'Gaudí architectural masterpieces, Mediterranean beaches, tapas bars, and vibrant Gothic Quarter.',
      timeZone: 'Europe/Madrid (GMT+2)',
      avgDailyCost: 140
    },
    {
      id: 'dest-santorini',
      name: 'Santorini',
      country: 'Greece',
      region: 'Europe',
      costIndex: '$$$',
      popularity: 9.7,
      rating: 4.91,
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      description: 'Iconic whitewashed caldera cliffside villas, cobalt blue domes, and world-famous Aegean sunsets.',
      timeZone: 'Europe/Athens (GMT+3)',
      avgDailyCost: 190
    },
    {
      id: 'dest-kyoto',
      name: 'Kyoto',
      country: 'Japan',
      region: 'Asia',
      costIndex: '$$',
      popularity: 9.7,
      rating: 4.92,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient capital of Japan with thousands of classical Buddhist temples, gardens, and imperial palaces.',
      timeZone: 'Asia/Tokyo (GMT+9)',
      avgDailyCost: 140
    },
    {
      id: 'dest-sydney',
      name: 'Sydney',
      country: 'Australia',
      region: 'Oceania',
      costIndex: '$$$',
      popularity: 9.5,
      rating: 4.86,
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
      description: 'Iconic Opera House, golden surf beaches at Bondi, scenic ferry rides, and coastal clifftop walks.',
      timeZone: 'Australia/Sydney (GMT+10)',
      avgDailyCost: 180
    },
    {
      id: 'dest-dubai',
      name: 'Dubai',
      country: 'United Arab Emirates',
      region: 'Middle East',
      costIndex: '$$$$',
      popularity: 9.6,
      rating: 4.88,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      description: 'Ultra-luxurious skyscrapers, desert safaris, man-made islands, and world-class shopping spectacles.',
      timeZone: 'Asia/Dubai (GMT+4)',
      avgDailyCost: 250
    },
    {
      id: 'dest-singapore',
      name: 'Singapore',
      country: 'Singapore',
      region: 'Asia',
      costIndex: '$$$',
      popularity: 9.6,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      description: 'Futuristic Gardens by the Bay, Michelin hawker stalls, lush urban greenery, and Marina Bay Sands.',
      timeZone: 'Asia/Singapore (GMT+8)',
      avgDailyCost: 175
    },
    {
      id: 'dest-cape-town',
      name: 'Cape Town',
      country: 'South Africa',
      region: 'Africa',
      costIndex: '$$',
      popularity: 9.3,
      rating: 4.82,
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
      description: 'Stunning coastal landscapes, Table Mountain cableway, wine estates, and vibrant wildlife.',
      timeZone: 'Africa/Johannesburg (GMT+2)',
      avgDailyCost: 95
    }
  ],

  // Comprehensive Catalog of Curated Activities by Destination
  ACTIVITIES_CATALOG: [
    // ----------------- PARIS -----------------
    {
      id: 'act-paris-hotel',
      cityId: 'dest-paris',
      cityName: 'Paris',
      name: 'Boutique Hotel Le Marais Check-in',
      category: 'stay',
      cost: 210,
      duration: '1.5 hrs',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      location: 'Le Marais, 4th Arrondissement, Paris',
      description: 'Settle into a stylish Parisian boutique hotel in the historic Marais district.'
    },
    {
      id: 'act-seine-cruise',
      cityId: 'dest-paris',
      cityName: 'Paris',
      name: 'Sunset Seine River Gourmet Cruise',
      category: 'food',
      cost: 110,
      duration: '2.0 hrs',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      location: 'Port de la Bourdonnais, Paris',
      description: '3-course French dining while gliding past illuminated monuments and Notre-Dame.'
    },
    {
      id: 'act-eiffel',
      cityId: 'dest-paris',
      cityName: 'Paris',
      name: 'Eiffel Tower Summit & Champagne Toast',
      category: 'sightseeing',
      cost: 45,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
      location: 'Champ de Mars, 5 Av. Anatole France, Paris',
      description: 'Skip-the-line access to the top floor with panoramic Parisian views and bubbly.'
    },
    {
      id: 'act-louvre',
      cityId: 'dest-paris',
      cityName: 'Paris',
      name: 'Louvre Masterpieces Guided Tour',
      category: 'culture',
      cost: 65,
      duration: '3.0 hrs',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
      location: 'Rue de Rivoli, 75001 Paris',
      description: 'Expert art historian tour covering the Mona Lisa, Venus de Milo, and Winged Victory.'
    },
    {
      id: 'act-croissant',
      cityId: 'dest-paris',
      cityName: 'Paris',
      name: 'Artisan Croissant & Pastry Workshop',
      category: 'food',
      cost: 85,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      location: 'Montmartre, 18th Arrondissement, Paris',
      description: 'Learn the secrets of laminated French butter dough in a cozy Montmartre bakery.'
    },
    {
      id: 'act-versailles',
      cityId: 'dest-paris',
      cityName: 'Paris',
      name: 'Palace of Versailles & Grand Gardens',
      category: 'sightseeing',
      cost: 75,
      duration: '4.5 hrs',
      image: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?auto=format&fit=crop&w=600&q=80',
      location: 'Place d\'Armes, 78000 Versailles',
      description: 'Explore the Hall of Mirrors, Royal Apartments, and Marie Antoinette\'s estate.'
    },
    {
      id: 'act-champs-shopping',
      cityId: 'dest-paris',
      cityName: 'Paris',
      name: 'Champs-Élysées & Ladurée Macarons',
      category: 'shopping',
      cost: 60,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
      location: 'Avenue des Champs-Élysées, Paris',
      description: 'Luxury promenade, Arc de Triomphe viewing, and afternoon French tea.'
    },

    // ----------------- TOKYO -----------------
    {
      id: 'act-tokyo-hotel',
      cityId: 'dest-tokyo',
      cityName: 'Tokyo',
      name: 'Shinjuku Skyscraper View Hotel Check-in',
      category: 'stay',
      cost: 180,
      duration: '1.5 hrs',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      location: 'Kabukicho, Shinjuku City, Tokyo',
      description: 'Check into a high-rise hotel overlooking the bustling neon streets of Shinjuku.'
    },
    {
      id: 'act-shibuya',
      cityId: 'dest-tokyo',
      cityName: 'Tokyo',
      name: 'Shibuya Crossing & Sky Observatory Deck',
      category: 'sightseeing',
      cost: 22,
      duration: '2.0 hrs',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
      location: '2 Chome-24-12 Shibuya, Tokyo',
      description: 'Witness the iconic Shibuya scramble and step out onto the 360-degree glass sky deck.'
    },
    {
      id: 'act-ramen-tour',
      cityId: 'dest-tokyo',
      cityName: 'Tokyo',
      name: 'Shinjuku Hidden Omoide Yokocho Food Tour',
      category: 'food',
      cost: 55,
      duration: '3.0 hrs',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      location: '1 Chome-2 Nishishinjuku, Tokyo',
      description: 'Taste authentic tonkotsu ramen, yakitori skewers, and craft sake in alleyways.'
    },
    {
      id: 'act-sensoji',
      cityId: 'dest-tokyo',
      cityName: 'Tokyo',
      name: 'Senso-ji Temple & Nakamise Street',
      category: 'culture',
      cost: 20,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      location: '2 Chome-3-1 Asakusa, Taito City, Tokyo',
      description: 'Tokyo\'s oldest ancient Buddhist temple and traditional street food stalls.'
    },
    {
      id: 'act-teamlab',
      cityId: 'dest-tokyo',
      cityName: 'Tokyo',
      name: 'teamLab Planets Digital Art Immersion',
      category: 'culture',
      cost: 38,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
      location: '6 Chome-1-16 Toyosu, Koto City, Tokyo',
      description: 'Walk through water, crystal infinite mirror rooms, and floating floral digital gardens.'
    },
    {
      id: 'act-akihabara',
      cityId: 'dest-tokyo',
      cityName: 'Tokyo',
      name: 'Akihabara Electric Town & Retro Arcades',
      category: 'shopping',
      cost: 40,
      duration: '3.0 hrs',
      image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=600&q=80',
      location: 'Sotokanda, Chiyoda City, Tokyo',
      description: 'Explore multi-story gadget markets, anime collectibles, and vintage gaming arcades.'
    },
    {
      id: 'act-shinkansen',
      cityId: 'dest-tokyo',
      cityName: 'Tokyo',
      name: 'Shinkansen Bullet Train to Mount Fuji',
      category: 'transport',
      cost: 110,
      duration: '3.0 hrs',
      image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=600&q=80',
      location: 'Tokyo Station, Marunouchi, Tokyo',
      description: 'High-speed 300 km/h rail journey with views of snow-capped Mount Fuji.'
    },

    // ----------------- ROME -----------------
    {
      id: 'act-colosseum',
      cityId: 'dest-rome',
      cityName: 'Rome',
      name: 'Colosseum Underground & Roman Forum',
      category: 'sightseeing',
      cost: 58,
      duration: '3.0 hrs',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
      location: 'Piazza del Colosseo, 1, 00184 Roma',
      description: 'Walk in the footsteps of Roman gladiators with exclusive arena floor and dungeon access.'
    },
    {
      id: 'act-vatican',
      cityId: 'dest-rome',
      cityName: 'Rome',
      name: 'Vatican Museums & Sistine Chapel Tour',
      category: 'culture',
      cost: 65,
      duration: '3.5 hrs',
      image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80',
      location: 'Viale Vaticano, 00165 Roma',
      description: 'Admire Michelangelo\'s famous frescoes on the Sistine Chapel ceiling and St. Peter\'s Basilica.'
    },
    {
      id: 'act-pasta-class',
      cityId: 'dest-rome',
      cityName: 'Rome',
      name: 'Trastevere Handmade Pasta & Gelato Masterclass',
      category: 'food',
      cost: 75,
      duration: '3.0 hrs',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      location: 'Piazza di Santa Maria in Trastevere, Roma',
      description: 'Roll fresh fettuccine, cook carbonara sauce, and make authentic Italian gelato with local chefs.'
    },
    {
      id: 'act-trevi',
      cityId: 'dest-rome',
      cityName: 'Rome',
      name: 'Trevi Fountain Coin Toss & Evening Piazza Walk',
      category: 'sightseeing',
      cost: 15,
      duration: '2.0 hrs',
      image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80',
      location: 'Piazza di Trevi, 00187 Roma',
      description: 'Toss a coin into the Trevi fountain and stroll through the illuminated Piazza Navona.'
    },

    // ----------------- SWITZERLAND (ZURICH & INTERLAKEN) -----------------
    {
      id: 'act-jungfrau',
      cityId: 'dest-zurich',
      cityName: 'Zurich & Interlaken',
      name: 'Jungfraujoch - Top of Europe Cogwheel Train',
      category: 'adventure',
      cost: 175,
      duration: '5.0 hrs',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
      location: 'Jungfraujoch, 3801 Fieschertal, Switzerland',
      description: 'Ascend to 3,454m altitude, explore ice tunnels, and gaze across the majestic Aletsch Glacier.'
    },
    {
      id: 'act-fondue',
      cityId: 'dest-zurich',
      cityName: 'Zurich & Interlaken',
      name: 'Traditional Swiss Cheese & Wine Fondue Chalet',
      category: 'food',
      cost: 60,
      duration: '2.0 hrs',
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
      location: 'Höheweg 74, 3800 Interlaken, Switzerland',
      description: 'Authentic gruyère and vacherin fondue served in a rustic 18th-century wooden alpine lodge.'
    },
    {
      id: 'act-lake-zurich',
      cityId: 'dest-zurich',
      cityName: 'Zurich & Interlaken',
      name: 'Lake Zurich Steamboat Cruise & Old Town',
      category: 'sightseeing',
      cost: 40,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80',
      location: 'Bürkliplatz, 8001 Zürich, Switzerland',
      description: 'Glide across crystal-clear Lake Zurich and wander medieval cobblestone alleys in Altstadt.'
    },

    // ----------------- BALI -----------------
    {
      id: 'act-ubud-swing',
      cityId: 'dest-bali',
      cityName: 'Bali',
      name: 'Ubud Rice Terrace Jungle Swing & Waterfall',
      category: 'adventure',
      cost: 35,
      duration: '4.0 hrs',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      location: 'Jl. Raya Tegallalang, Gianyar, Bali',
      description: 'Soar high above Tegallalang rice paddies and swim in Tegenungan jungle waterfall.'
    },
    {
      id: 'act-spa-bali',
      cityId: 'dest-bali',
      cityName: 'Bali',
      name: 'Balinese Flower Bath & Herbal Massage',
      category: 'stay',
      cost: 45,
      duration: '2.0 hrs',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      location: 'Ubud Centre, Gianyar, Bali',
      description: 'Relaxing holistic traditional body scrub followed by a scented frangipani flower bath.'
    },
    {
      id: 'act-uluwatu',
      cityId: 'dest-bali',
      cityName: 'Bali',
      name: 'Uluwatu Clifftop Temple & Kecak Fire Dance',
      category: 'culture',
      cost: 30,
      duration: '3.0 hrs',
      image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80',
      location: 'Pecatu, South Kuta, Badung Regency, Bali',
      description: 'Ancient sea temple perched on dramatic 70-meter cliffs with hypnotic sunset fire dance.'
    },

    // ----------------- NEW YORK CITY -----------------
    {
      id: 'act-central-park',
      cityId: 'dest-nyc',
      cityName: 'New York City',
      name: 'Central Park Bicycle Tour & Picnic',
      category: 'adventure',
      cost: 35,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=600&q=80',
      location: 'Central Park, Manhattan, New York',
      description: 'Pedal past Bethesda Fountain, Strawberry Fields, and Bow Bridge.'
    },
    {
      id: 'act-summit-one',
      cityId: 'dest-nyc',
      cityName: 'New York City',
      name: 'SUMMIT One Vanderbilt Mirror Observatory',
      category: 'sightseeing',
      cost: 48,
      duration: '2.0 hrs',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
      location: '45 E 42nd St, New York, NY 10017',
      description: 'Mirrored infinity sky rooms offering skyline vistas of the Empire State and Chrysler buildings.'
    },
    {
      id: 'act-broadway',
      cityId: 'dest-nyc',
      cityName: 'New York City',
      name: 'Broadway Musical Show & Times Square',
      category: 'culture',
      cost: 135,
      duration: '3.5 hrs',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
      location: 'Theater District, Manhattan, NY',
      description: 'Premium orchestra seating for an acclaimed musical, followed by Times Square night lights.'
    },

    // ----------------- LONDON -----------------
    {
      id: 'act-london-tower',
      cityId: 'dest-london',
      cityName: 'London',
      name: 'Tower of London & Crown Jewels Tour',
      category: 'culture',
      cost: 42,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
      location: 'Tower of London, London EC3N 4AB',
      description: 'Discover centuries of royal intrigue and behold the Crown Jewels with a Yeoman Warder guide.'
    },
    {
      id: 'act-london-tea',
      cityId: 'dest-london',
      cityName: 'London',
      name: 'Traditional Afternoon Tea at The Ritz',
      category: 'food',
      cost: 85,
      duration: '2.0 hrs',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      location: '150 Piccadilly, St. James\'s, London',
      description: 'Finest artisanal teas, warm scones with clotted cream, and finger sandwiches in Palm Court.'
    },
    {
      id: 'act-london-eye',
      cityId: 'dest-london',
      cityName: 'London',
      name: 'London Eye Sunset Flight & Westminster',
      category: 'sightseeing',
      cost: 38,
      duration: '2.0 hrs',
      image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=600&q=80',
      location: 'Riverside Building, County Hall, London',
      description: 'Spectacular 360-degree aerial views over Big Ben, the Houses of Parliament, and River Thames.'
    },

    // ----------------- BARCELONA -----------------
    {
      id: 'act-sagrada',
      cityId: 'dest-barcelona',
      cityName: 'Barcelona',
      name: 'Sagrada Família Towers Guided Tour',
      category: 'sightseeing',
      cost: 45,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80',
      location: 'C/ de Mallorca, 401, 08013 Barcelona',
      description: 'Marvel at Antoni Gaudí\'s stained glass light towers and tree-like stone columns.'
    },
    {
      id: 'act-park-guell',
      cityId: 'dest-barcelona',
      cityName: 'Barcelona',
      name: 'Park Güell Mosaic Terrace & Gardens',
      category: 'culture',
      cost: 25,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1564221710304-0b34002639b2?auto=format&fit=crop&w=600&q=80',
      location: '08024 Barcelona, Spain',
      description: 'Stroll through the iconic colorful mosaic salamander benches overlooking the Mediterranean Sea.'
    },
    {
      id: 'act-tapas-barcelona',
      cityId: 'dest-barcelona',
      cityName: 'Barcelona',
      name: 'El Born Tapas Crawl & Sangria Tasting',
      category: 'food',
      cost: 55,
      duration: '3.0 hrs',
      image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=600&q=80',
      location: 'El Born, Ciutat Vella, Barcelona',
      description: 'Savor patatas bravas, Iberian jamón, garlic prawns, and refreshing cava in medieval alleys.'
    },

    // ----------------- SANTORINI -----------------
    {
      id: 'act-oia-sunset',
      cityId: 'dest-santorini',
      cityName: 'Santorini',
      name: 'Oia Blue Dome Walk & Sunset Catamaran',
      category: 'sightseeing',
      cost: 120,
      duration: '4.0 hrs',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
      location: 'Oia Caldera, 847 02 Santorini, Greece',
      description: 'Sail through volcanic hot springs and watch world-famous golden sunsets over the Aegean.'
    },
    {
      id: 'act-greek-wine',
      cityId: 'dest-santorini',
      cityName: 'Santorini',
      name: 'Volcanic Vineyards Assyrtiko Wine Tasting',
      category: 'food',
      cost: 65,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
      location: 'Pyrgos Kallistis, Santorini',
      description: 'Sample crisp mineral Assyrtiko and sweet Vinsanto wines on a clifftop tasting terrace.'
    },

    // ----------------- DUBAI -----------------
    {
      id: 'act-burj-khalifa',
      cityId: 'dest-dubai',
      cityName: 'Dubai',
      name: 'Burj Khalifa 148th Floor Sky Lounge',
      category: 'sightseeing',
      cost: 95,
      duration: '2.5 hrs',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
      location: '1 Sheikh Mohammed bin Rashid Blvd, Dubai',
      description: 'Stand atop the world\'s tallest skyscraper with VIP refreshments and 360-degree desert panoramas.'
    },
    {
      id: 'act-desert-safari',
      cityId: 'dest-dubai',
      cityName: 'Dubai',
      name: 'Red Dunes Desert Safari & Bedouin BBQ',
      category: 'adventure',
      cost: 75,
      duration: '5.0 hrs',
      image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=600&q=80',
      location: 'Lahbab Desert, Dubai',
      description: '4x4 dune bashing, camel rides, sandboarding, and traditional BBQ buffet under desert stars.'
    },

    // ----------------- SINGAPORE -----------------
    {
      id: 'act-gardens-bay',
      cityId: 'dest-singapore',
      cityName: 'Singapore',
      name: 'Gardens by the Bay & Supertree Observatory',
      category: 'sightseeing',
      cost: 32,
      duration: '3.0 hrs',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
      location: '18 Marina Gardens Dr, Singapore 018953',
      description: 'Explore the Cloud Forest indoor waterfall and walk the illuminated OCBC Skyway.'
    },
    {
      id: 'act-hawker-food',
      cityId: 'dest-singapore',
      cityName: 'Singapore',
      name: 'Lau Pa Sat Michelin Hawker Culinary Walk',
      category: 'food',
      cost: 28,
      duration: '2.0 hrs',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      location: '18 Raffles Quay, Singapore 048582',
      description: 'Taste authentic Hainanese chicken rice, char kway teow noodles, and smoky satay skewers.'
    }
  ],

  // Initial Seed Trips for Demo User (Alex River)
  INITIAL_SEED_TRIPS: [
    {
      id: 'trip-paris-alps',
      title: 'Grand Europe: Paris & Swiss Alps',
      description: 'An unforgettable 7-day blend of Parisian culture, haute cuisine, and breathtaking snow-capped Swiss mountains.',
      destination: 'Paris & Switzerland',
      startDate: '2026-09-10',
      endDate: '2026-09-16',
      budget: 2500,
      currency: 'USD',
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      tags: ['Culture', 'Adventure', 'Foodie'],
      stops: [
        {
          id: 'stop-1',
          cityName: 'Paris',
          country: 'France',
          arrivalDate: '2026-09-10',
          departureDate: '2026-09-13',
          timeZone: 'Europe/Paris'
        },
        {
          id: 'stop-2',
          cityName: 'Interlaken & Zurich',
          country: 'Switzerland',
          arrivalDate: '2026-09-13',
          departureDate: '2026-09-16',
          timeZone: 'Europe/Zurich'
        }
      ],
      days: [
        {
          dayNumber: 1,
          date: '2026-09-10',
          city: 'Paris',
          activities: [
            {
              id: 'act-1-1',
              name: 'Arrive at Paris CDG & Boutique Hotel Check-in',
              category: 'stay',
              startTime: '14:00',
              endTime: '15:30',
              cost: 210,
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
              notes: 'Hotel Le Marais - Room 402',
              location: 'Le Marais, Paris'
            },
            {
              id: 'act-1-2',
              name: 'Sunset Seine River Gourmet Dinner Cruise',
              category: 'food',
              startTime: '18:30',
              endTime: '20:30',
              cost: 110,
              image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
              notes: 'Boarding near Pont Neuf',
              location: 'Seine River, Paris'
            },
            {
              id: 'act-1-3',
              name: 'Eiffel Tower Night Illumination Walk',
              category: 'sightseeing',
              startTime: '21:00',
              endTime: '22:30',
              cost: 0,
              image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
              notes: 'Light sparkle show at top of the hour',
              location: 'Champ de Mars, Paris'
            }
          ]
        },
        {
          dayNumber: 2,
          date: '2026-09-11',
          city: 'Paris',
          activities: [
            {
              id: 'act-2-1',
              name: 'Louvre Masterpieces Guided Tour',
              category: 'culture',
              startTime: '09:30',
              endTime: '12:30',
              cost: 65,
              image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
              notes: 'Meet guide at Pyramid entrance',
              location: 'Rue de Rivoli, Paris'
            },
            {
              id: 'act-2-2',
              name: 'Artisan Croissant & Pastry Workshop',
              category: 'food',
              startTime: '14:00',
              endTime: '16:30',
              cost: 85,
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
              notes: 'Chef Pierre bakery class',
              location: 'Montmartre, Paris'
            },
            {
              id: 'act-2-3',
              name: 'Eiffel Tower Summit & Champagne Toast',
              category: 'sightseeing',
              startTime: '18:00',
              endTime: '20:00',
              cost: 45,
              image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
              notes: 'Voucher #GT-9941',
              location: 'Champ de Mars, Paris'
            }
          ]
        },
        {
          dayNumber: 3,
          date: '2026-09-12',
          city: 'Paris',
          activities: [
            {
              id: 'act-3-1',
              name: 'Palace of Versailles Express Excursion',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '14:00',
              cost: 75,
              image: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?auto=format&fit=crop&w=600&q=80',
              notes: 'Includes Hall of Mirrors & Royal Gardens',
              location: 'Place d\'Armes, Versailles'
            },
            {
              id: 'act-3-2',
              name: 'Luxury Shopping & Macarons at Champs-Élysées',
              category: 'shopping',
              startTime: '15:30',
              endTime: '18:00',
              cost: 120,
              image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
              notes: 'Ladurée afternoon tea',
              location: 'Avenue des Champs-Élysées, Paris'
            }
          ]
        },
        {
          dayNumber: 4,
          date: '2026-09-13',
          city: 'Interlaken & Zurich',
          activities: [
            {
              id: 'act-4-1',
              name: 'TGV Lyria High-Speed Train Paris to Zurich',
              category: 'transport',
              startTime: '08:30',
              endTime: '12:30',
              cost: 140,
              image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=600&q=80',
              notes: 'First Class Coach 2, Seat 45/46',
              location: 'Gare de Lyon, Paris'
            },
            {
              id: 'act-4-2',
              name: 'Traditional Swiss Cheese & Wine Fondue Chalet',
              category: 'food',
              startTime: '19:00',
              endTime: '21:30',
              cost: 60,
              image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
              notes: 'Fondue Stube Interlaken',
              location: 'Höheweg 74, Interlaken'
            }
          ]
        },
        {
          dayNumber: 5,
          date: '2026-09-14',
          city: 'Interlaken & Zurich',
          activities: [
            {
              id: 'act-5-1',
              name: 'Jungfraujoch - Top of Europe Cogwheel Train',
              category: 'adventure',
              startTime: '09:00',
              endTime: '15:00',
              cost: 175,
              image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
              notes: 'Bring warm winter jacket & sunglasses',
              location: 'Jungfraujoch, Fieschertal'
            },
            {
              id: 'act-5-2',
              name: 'Scenic Lake Brienz Sunset Walk',
              category: 'sightseeing',
              startTime: '17:30',
              endTime: '19:30',
              cost: 0,
              image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80',
              notes: 'Turquoise alpine waters photography',
              location: 'Brienz Promenade, Switzerland'
            }
          ]
        }
      ]
    }
  ]
};
