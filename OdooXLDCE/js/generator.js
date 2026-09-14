/**
 * GlobeTrotter Intelligent Itinerary Auto-Generation Engine
 * Generates rich, day-by-day itineraries with photos, times, locations, and costs
 * customized by destination (country or city) and stay duration (number of days).
 */

const ItineraryGenerator = {
  // Destination knowledge base with multi-day activity pools
  destinations: {
    // === CITIES ===
    'tokyo': {
      name: 'Tokyo',
      country: 'Japan',
      type: 'city',
      currency: 'JPY',
      coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 160,
      days: [
        {
          theme: 'Ancient Shrines & Neon Cyberpunk',
          activities: [
            {
              name: 'Sensō-ji Temple & Nakamise Street',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '11:30',
              cost: 15,
              location: 'Asakusa, Tokyo',
              image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
              notes: 'Tokyo\'s oldest Buddhist temple. Try freshly pressed senbei rice crackers along the Nakamise shopping arcade.',
              duration: '2.5 hrs'
            },
            {
              name: 'Tsukiji Outer Fish Market Street Food Tasting',
              category: 'food',
              startTime: '12:00',
              endTime: '13:45',
              cost: 35,
              location: 'Tsukiji, Chuo',
              image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
              notes: 'Sample freshly torched wagyu beef skewers, tamagoyaki egg omelettes, and bluefin sashimi bowls.',
              duration: '1.75 hrs'
            },
            {
              name: 'Akihabara Electric Town & Retro Arcades',
              category: 'culture',
              startTime: '14:30',
              endTime: '17:30',
              cost: 25,
              location: 'Akihabara, Chiyoda',
              image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
              notes: 'Explore multi-story retro game centers, manga superstores, and electronic emporiums.',
              duration: '3.0 hrs'
            },
            {
              name: 'Shibuya Scramble & Sky Rooftop Observatory',
              category: 'nightlife',
              startTime: '18:30',
              endTime: '21:00',
              cost: 30,
              location: 'Shibuya Crossing, Shibuya',
              image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
              notes: 'Witness the world\'s busiest pedestrian intersection from the open-air 47th floor sky observatory.',
              duration: '2.5 hrs'
            }
          ]
        },
        {
          theme: 'Digital Art & High-Tech Harbors',
          activities: [
            {
              name: 'Meiji Jingu Shrine & Yoyogi Forest Walk',
              category: 'culture',
              startTime: '09:00',
              endTime: '11:00',
              cost: 10,
              location: 'Shibuya, Tokyo',
              image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
              notes: 'Tranquil forested shrine dedicated to Emperor Meiji, entered through giant 1500-year-old cedar torii gates.',
              duration: '2.0 hrs'
            },
            {
              name: 'Harajuku Takeshita Street & Sweet Crêpes',
              category: 'shopping',
              startTime: '11:30',
              endTime: '13:30',
              cost: 20,
              location: 'Takeshita Street, Harajuku',
              image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
              notes: 'Eclectic teen fashion, boutique coffee shops, and towering multi-flavor rainbow cotton candy.',
              duration: '2.0 hrs'
            },
            {
              name: 'teamLab Planets Digital Art Immersion',
              category: 'culture',
              startTime: '14:30',
              endTime: '17:00',
              cost: 38,
              location: 'Toyosu, Koto',
              image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
              notes: 'Walk barefoot through water, infinite crystal light mirrors, and floating flower gardens.',
              duration: '2.5 hrs'
            },
            {
              name: 'Shinjuku Omoide Yokocho Yakitori & Izakaya',
              category: 'food',
              startTime: '18:30',
              endTime: '21:30',
              cost: 50,
              location: 'Omoide Yokocho, Shinjuku',
              image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
              notes: 'Atmospheric lantern-lit alleyways serving grilled binchotan yakitori skewers and draft craft beer.',
              duration: '3.0 hrs'
            }
          ]
        },
        {
          theme: 'Imperial Gardens & Panoramic Skylines',
          activities: [
            {
              name: 'Tokyo Imperial Palace East Gardens',
              category: 'sightseeing',
              startTime: '09:30',
              endTime: '11:30',
              cost: 0,
              location: 'Chiyoda, Tokyo',
              image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
              notes: 'Ancient stone castle walls, moats, and meticulously manicured Japanese pine trees.',
              duration: '2.0 hrs'
            },
            {
              name: 'Ginza Gourmet Tempura Lunch & Gallery Hopping',
              category: 'food',
              startTime: '12:00',
              endTime: '14:00',
              cost: 65,
              location: 'Ginza, Chuo',
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
              notes: 'Light-as-air seasonal tempura tasting menu followed by Tokyo\'s premier luxury shopping boulevard.',
              duration: '2.0 hrs'
            },
            {
              name: 'Roppongi Hills Mori Art Museum & Tokyo Tower View',
              category: 'culture',
              startTime: '15:00',
              endTime: '17:30',
              cost: 25,
              location: 'Roppongi, Minato',
              image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
              notes: 'World-class contemporary art exhibitions overlooking the crimson beacon of Tokyo Tower.',
              duration: '2.5 hrs'
            },
            {
              name: 'Golden Gai Micro-Bars Exploration',
              category: 'nightlife',
              startTime: '19:00',
              endTime: '22:00',
              cost: 40,
              location: 'Kabukicho, Shinjuku',
              image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
              notes: 'Network of six tiny alleys packed with over 200 eccentric, intimate 6-seater drinking dens.',
              duration: '3.0 hrs'
            }
          ]
        },
        {
          theme: 'Artisan Heritage & Retro Neighborhoods',
          activities: [
            {
              name: 'Yanaka Ginza Old Tokyo Walking Tour',
              category: 'culture',
              startTime: '09:30',
              endTime: '11:45',
              cost: 15,
              location: 'Yanaka, Taito',
              image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
              notes: 'Discover nostalgic wooden houses, artisan paper crafts, and historic cemetery gardens that survived WWII.',
              duration: '2.25 hrs'
            },
            {
              name: 'Ueno Park & National Museum of Nature and Science',
              category: 'sightseeing',
              startTime: '12:30',
              endTime: '15:00',
              cost: 20,
              location: 'Ueno Park, Taito',
              image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
              notes: 'Stroll around Shinobazu Lotus Pond and explore treasures spanning Asian imperial history.',
              duration: '2.5 hrs'
            },
            {
              name: 'Sumida River Water Bus Cruise to Odaiba',
              category: 'transport',
              startTime: '15:30',
              endTime: '17:30',
              cost: 25,
              location: 'Sumida River, Tokyo',
              image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=600&q=80',
              notes: 'Cruise under historic bridges on the futuristic Himiko cruiser boat with panoramic glass canopies.',
              duration: '2.0 hrs'
            },
            {
              name: 'Rainbow Bridge Sunset & Odaiba Waterfront Dining',
              category: 'food',
              startTime: '18:30',
              endTime: '21:00',
              cost: 55,
              location: 'Odaiba Seaside Park, Minato',
              image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
              notes: 'Watch the illuminated skyline reflection across Tokyo Bay beside the giant life-sized Unicorn Gundam.',
              duration: '2.5 hrs'
            }
          ]
        }
      ]
    },

    'paris': {
      name: 'Paris',
      country: 'France',
      type: 'city',
      currency: 'EUR',
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 180,
      days: [
        {
          theme: 'Icons of the City of Light',
          activities: [
            {
              name: 'Eiffel Tower Summit & Champagne Toast',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '11:30',
              cost: 45,
              location: 'Champ de Mars, 7th Arr.',
              image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
              notes: 'Ascend to the highest accessible platform in Paris for 360-degree vistas across the Seine valley.',
              duration: '2.5 hrs'
            },
            {
              name: 'Café de Flore & Saint-Germain Literary Lunch',
              category: 'food',
              startTime: '12:00',
              endTime: '13:45',
              cost: 40,
              location: 'Boulevard Saint-Germain, 6th Arr.',
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
              notes: 'Historic intellectual café frequented by Hemingway and Sartre. Classic croque monsieur & café au lait.',
              duration: '1.75 hrs'
            },
            {
              name: 'Musée d\'Orsay Impressionist Masterpieces',
              category: 'culture',
              startTime: '14:30',
              endTime: '17:30',
              cost: 22,
              location: 'Rue de la Légion d\'Honneur, 7th Arr.',
              image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
              notes: 'Housed in a grand Beaux-Arts railway station; houses the world\'s largest collection of Monet, Van Gogh, and Renoir.',
              duration: '3.0 hrs'
            },
            {
              name: 'Sunset Seine River Gourmet Dinner Cruise',
              category: 'food',
              startTime: '19:00',
              endTime: '21:30',
              cost: 110,
              location: 'Port de la Bourdonnais, 7th Arr.',
              image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
              notes: 'Three-course French gastronomic meal while drifting past floodlit cathedrals and bridges.',
              duration: '2.5 hrs'
            }
          ]
        },
        {
          theme: 'Art, Palaces & Bohemian Montmartre',
          activities: [
            {
              name: 'Louvre Palace & Mona Lisa Early Access',
              category: 'culture',
              startTime: '09:00',
              endTime: '12:30',
              cost: 65,
              location: 'Pyramide du Louvre, 1st Arr.',
              image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
              notes: 'Priority entrance to see Winged Victory of Samothrace, Venus de Milo, and French Crown Jewels.',
              duration: '3.5 hrs'
            },
            {
              name: 'Jardin des Tuileries Garden Walk & Crêperie',
              category: 'food',
              startTime: '13:00',
              endTime: '14:15',
              cost: 20,
              location: 'Jardin des Tuileries, 1st Arr.',
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
              notes: 'Relax beside the marble fountains with a warm salted butter caramel crêpe.',
              duration: '1.25 hrs'
            },
            {
              name: 'Montmartre Artists Square & Sacré-Cœur Basilica',
              category: 'sightseeing',
              startTime: '15:00',
              endTime: '17:45',
              cost: 12,
              location: 'Place du Tertre, 18th Arr.',
              image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
              notes: 'Cobblestone hills where Picasso and Dalí painted; panoramic sunset view over all of Paris.',
              duration: '2.75 hrs'
            },
            {
              name: 'Moulin Rouge Cabaret & Champagne Night',
              category: 'nightlife',
              startTime: '20:30',
              endTime: '23:00',
              cost: 135,
              location: 'Boulevard de Clichy, 18th Arr.',
              image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
              notes: 'The birthplace of the French can-can with spectacular costumes, acrobats, and vintage champagne.',
              duration: '2.5 hrs'
            }
          ]
        },
        {
          theme: 'Royal Opulence & Marais Boutiques',
          activities: [
            {
              name: 'Palace of Versailles Hall of Mirrors & Royal Gardens',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '13:30',
              cost: 75,
              location: 'Place d\'Armes, Versailles',
              image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
              notes: 'Golden baroque residence of King Louis XIV with musical fountain shows and Marie Antoinette\'s estate.',
              duration: '4.5 hrs'
            },
            {
              name: 'Le Marais Falafel & Pastry Trail',
              category: 'food',
              startTime: '14:30',
              endTime: '16:00',
              cost: 25,
              location: 'Rue des Rosiers, 4th Arr.',
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
              notes: 'Famous L\'As du Fallafel sandwich followed by pistachio macarons at Carette in Place des Vosges.',
              duration: '1.5 hrs'
            },
            {
              name: 'Île de la Cité, Notre-Dame & Sainte-Chapelle',
              category: 'culture',
              startTime: '16:30',
              endTime: '18:30',
              cost: 20,
              location: 'Île de la Cité, 4th Arr.',
              image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
              notes: 'Admire the 13th-century stained glass jewel box of Sainte-Chapelle and the reborn Notre-Dame Cathedral.',
              duration: '2.0 hrs'
            },
            {
              name: 'Champs-Élysées & Arc de Triomphe Night Vista',
              category: 'shopping',
              startTime: '19:30',
              endTime: '22:00',
              cost: 45,
              location: 'Place Charles de Gaulle, 8th Arr.',
              image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
              notes: 'Climb 284 steps to the roof of the triumphal arch as the 12 radiating grand avenues glitter below.',
              duration: '2.5 hrs'
            }
          ]
        }
      ]
    },

    'rome': {
      name: 'Rome',
      country: 'Italy',
      type: 'city',
      currency: 'EUR',
      coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 150,
      days: [
        {
          theme: 'Glory of Ancient Rome',
          activities: [
            {
              name: 'Colosseum Arena Floor & Underground Dungeons',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '11:45',
              cost: 40,
              location: 'Piazza del Colosseo, Rome',
              image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
              notes: 'Walk where gladiators stood and explore the subterranean hypogeum staging elevators.',
              duration: '2.75 hrs'
            },
            {
              name: 'Roman Forum & Palatine Hill Imperial Ruins',
              category: 'culture',
              startTime: '12:00',
              endTime: '14:00',
              cost: 20,
              location: 'Via dei Fori Imperiali, Rome',
              image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
              notes: 'The political beating heart of the Roman Empire amidst soaring stone columns and pine hills.',
              duration: '2.0 hrs'
            },
            {
              name: 'Traditional Cacio e Pepe Trattoria Lunch',
              category: 'food',
              startTime: '14:15',
              endTime: '15:45',
              cost: 30,
              location: 'Monti District, Rome',
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
              notes: 'Tonnarelli pasta tossed in creamy pecorino romano and toasted black pepper with house Chianti.',
              duration: '1.5 hrs'
            },
            {
              name: 'Trevi Fountain Coin Toss & Artisanal Gelato',
              category: 'sightseeing',
              startTime: '18:30',
              endTime: '21:00',
              cost: 15,
              location: 'Piazza di Trevi, Rome',
              image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
              notes: 'Toss a coin with your right hand over your left shoulder to ensure your return to Rome.',
              duration: '2.5 hrs'
            }
          ]
        },
        {
          theme: 'Vatican Wonders & Renaissance Splendor',
          activities: [
            {
              name: 'Vatican Museums & Sistine Chapel Ceiling',
              category: 'culture',
              startTime: '08:30',
              endTime: '12:00',
              cost: 55,
              location: 'Viale Vaticano, Vatican City',
              image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
              notes: 'Gaze up in silence at Michelangelo\'s breathtaking ceiling frescoes and The Last Judgement.',
              duration: '3.5 hrs'
            },
            {
              name: 'St. Peter\'s Basilica Dome Climb',
              category: 'sightseeing',
              startTime: '12:15',
              endTime: '14:00',
              cost: 18,
              location: 'Piazza San Pietro, Vatican City',
              image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
              notes: 'Climb 551 steps inside the colossal cupola for the definitive bird\'s-eye panorama over Rome.',
              duration: '1.75 hrs'
            },
            {
              name: 'Pantheon & Piazza Navona Fountains Stroll',
              category: 'sightseeing',
              startTime: '15:00',
              endTime: '17:30',
              cost: 10,
              location: 'Piazza della Rotonda, Rome',
              image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
              notes: 'Marvel at the ancient unreinforced concrete dome and oculus, built by Emperor Hadrian.',
              duration: '2.5 hrs'
            },
            {
              name: 'Trastevere Sunset Wine & Pizza Tour',
              category: 'food',
              startTime: '18:30',
              endTime: '22:00',
              cost: 65,
              location: 'Trastevere, Rome',
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
              notes: 'Ivy-draped medieval streets with wood-fired crispy Roman pizza, supplì croquettes, and local prosecco.',
              duration: '3.5 hrs'
            }
          ]
        }
      ]
    },

    'zurich': {
      name: 'Zurich & Interlaken',
      country: 'Switzerland',
      type: 'city',
      currency: 'CHF',
      coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 240,
      days: [
        {
          theme: 'Jungfrau Region Alpine High Altitude',
          activities: [
            {
              name: 'Jungfraujoch - Top of Europe Cogwheel Train',
              category: 'adventure',
              startTime: '08:30',
              endTime: '13:30',
              cost: 175,
              location: 'Jungfraujoch, Interlaken',
              image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
              notes: 'Ascend to 3,454m altitude, walk through glacial ice tunnels, and gaze across the mighty Aletsch Glacier.',
              duration: '5.0 hrs'
            },
            {
              name: 'Traditional Swiss Cheese & Wine Fondue Chalet',
              category: 'food',
              startTime: '14:30',
              endTime: '16:30',
              cost: 60,
              location: 'Interlaken Alpine Lodge',
              image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
              notes: 'Authentic gruyère and vacherin fondue served in a rustic 18th-century wooden alpine lodge.',
              duration: '2.0 hrs'
            },
            {
              name: 'Lake Brienz Turquoise Water Steamboat Cruise',
              category: 'sightseeing',
              startTime: '17:00',
              endTime: '19:00',
              cost: 45,
              location: 'Brienz Harbor, Interlaken',
              image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
              notes: 'Glacier-fed deep turquoise waters surrounded by cascading waterfalls and towering cliffs.',
              duration: '2.0 hrs'
            }
          ]
        },
        {
          theme: 'Zürich Altstadt & Luxury Chocolatiers',
          activities: [
            {
              name: 'Zürich Old Town & Lindenhof Hill Walk',
              category: 'sightseeing',
              startTime: '09:30',
              endTime: '12:00',
              cost: 0,
              location: 'Lindenhof, Zürich',
              image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
              notes: 'Overlook the Limmat River from historic Roman fortress grounds and stroll medieval guild alleys.',
              duration: '2.5 hrs'
            },
            {
              name: 'Lindt Home of Chocolate Giant Fountain Tour',
              category: 'culture',
              startTime: '13:30',
              endTime: '16:00',
              cost: 35,
              location: 'Kilchberg, Zürich',
              image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
              notes: 'Stand in front of a 9-meter real liquid chocolate fountain with unlimited Swiss truffle tastings.',
              duration: '2.5 hrs'
            },
            {
              name: 'Sunset Lake Zurich Solar Catamaran Cruise',
              category: 'transport',
              startTime: '17:30',
              endTime: '19:30',
              cost: 50,
              location: 'Bürkliplatz, Zürich',
              image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
              notes: 'Eco-powered silent gliding along golden hour shores with view of distant snowy Alpine peaks.',
              duration: '2.0 hrs'
            }
          ]
        }
      ]
    },

    'bali': {
      name: 'Bali',
      country: 'Indonesia',
      type: 'city',
      currency: 'USD',
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 75,
      days: [
        {
          theme: 'Ubud Rice Terraces & Jungle Waterfalls',
          activities: [
            {
              name: 'Tegallalang Rice Terrace & Giant Jungle Swing',
              category: 'adventure',
              startTime: '08:30',
              endTime: '11:30',
              cost: 35,
              location: 'Tegallalang, Ubud',
              image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
              notes: 'Soar high above emerald rice terraces and learn ancient Subak irrigation heritage.',
              duration: '3.0 hrs'
            },
            {
              name: 'Organic Farm-to-Table Bamboo Shaded Lunch',
              category: 'food',
              startTime: '12:00',
              endTime: '13:30',
              cost: 20,
              location: 'Sayan Valley, Ubud',
              image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
              notes: 'Crispy duck betutu and fresh dragonfruit smoothie bowls served over river valleys.',
              duration: '1.5 hrs'
            },
            {
              name: 'Sacred Monkey Forest Sanctuary Walk',
              category: 'culture',
              startTime: '14:30',
              endTime: '16:30',
              cost: 15,
              location: 'Padangtegal, Ubud',
              image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
              notes: 'Encounter over 1,000 Balinese long-tailed macaques nestled inside ancient mossy Hindu temples.',
              duration: '2.0 hrs'
            },
            {
              name: 'Balinese Flower Bath & Herbal Healing Massage',
              category: 'stay',
              startTime: '17:30',
              endTime: '19:30',
              cost: 45,
              location: 'Campuhan, Ubud',
              image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
              notes: 'Holistic full-body traditional massage followed by a warm bath scented with frangipani blossoms.',
              duration: '2.0 hrs'
            }
          ]
        },
        {
          theme: 'Coastal Cliffs, Sunsets & Surf',
          activities: [
            {
              name: 'Nusa Penida Kelingking T-Rex Beach Day Cruise',
              category: 'adventure',
              startTime: '08:00',
              endTime: '14:00',
              cost: 65,
              location: 'Nusa Penida Island',
              image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
              notes: 'Speedboat transfer to witness the world-famous Tyrannosaurus cliff formation and azure waters.',
              duration: '6.0 hrs'
            },
            {
              name: 'Uluwatu Clifftop Temple & Kecak Fire Dance',
              category: 'culture',
              startTime: '16:30',
              endTime: '19:00',
              cost: 25,
              location: 'Pecatu, South Kuta',
              image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
              notes: 'Dramatic cliff theater 70 meters above the Indian Ocean as sunset fires illuminate chanting dancers.',
              duration: '2.5 hrs'
            },
            {
              name: 'Jimbaran Bay Candlelit Seafood BBQ on the Sand',
              category: 'food',
              startTime: '19:30',
              endTime: '22:00',
              cost: 40,
              location: 'Jimbaran Beach, Kuta',
              image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
              notes: 'Freshly grilled red snapper, jumbo prawns, and clams marinated in Balinese spices right on the surf.',
              duration: '2.5 hrs'
            }
          ]
        }
      ]
    },

    'new york': {
      name: 'New York City',
      country: 'United States',
      type: 'city',
      currency: 'USD',
      coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 260,
      days: [
        {
          theme: 'Midtown Marvels & Broadway Lights',
          activities: [
            {
              name: 'Central Park Morning Walk & Bethesda Fountain',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '11:00',
              cost: 0,
              location: 'Central Park, Manhattan',
              image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
              notes: 'Stroll past the Mall elms, rowboats at the Loeb Boathouse, and Strawberry Fields.',
              duration: '2.0 hrs'
            },
            {
              name: 'The Metropolitan Museum of Art (The Met)',
              category: 'culture',
              startTime: '11:30',
              endTime: '14:30',
              cost: 30,
              location: '5th Ave, Manhattan',
              image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
              notes: 'Temple of Dendur, European masters, and panoramic rooftop sculpture garden views.',
              duration: '3.0 hrs'
            },
            {
              name: 'Top of the Rock Observation Deck at Sunset',
              category: 'sightseeing',
              startTime: '16:00',
              endTime: '18:00',
              cost: 45,
              location: 'Rockefeller Center, Manhattan',
              image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
              notes: 'Unobstructed direct line of sight to the Empire State Building and lower Manhattan skyline.',
              duration: '2.0 hrs'
            },
            {
              name: 'Broadway Musical & Times Square Neon Walk',
              category: 'nightlife',
              startTime: '19:30',
              endTime: '22:30',
              cost: 140,
              location: 'Theater District, Broadway',
              image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
              notes: 'Tony-winning musical performance followed by midnight stroll across vibrant Times Square.',
              duration: '3.0 hrs'
            }
          ]
        },
        {
          theme: 'Downtown Waterfront & Historic Brooklyn',
          activities: [
            {
              name: 'High Line Elevated Park & Chelsea Market',
              category: 'food',
              startTime: '09:30',
              endTime: '12:00',
              cost: 25,
              location: 'Meatpacking District, Manhattan',
              image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
              notes: 'Repurposed railway park with public sculptures, lobster rolls, and artisan espresso.',
              duration: '2.5 hrs'
            },
            {
              name: 'Brooklyn Bridge Walk & DUMBO Skyline View',
              category: 'sightseeing',
              startTime: '13:00',
              endTime: '15:30',
              cost: 0,
              location: 'Brooklyn Bridge, NY',
              image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
              notes: 'Historic suspension bridge boardwalk leading to Washington Street cobblestone photo spot.',
              duration: '2.5 hrs'
            },
            {
              name: 'One World Observatory & 9/11 Memorial',
              category: 'culture',
              startTime: '16:30',
              endTime: '18:30',
              cost: 44,
              location: 'Financial District, Manhattan',
              image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
              notes: 'SkyPod elevators climbing 102 floors in 47 seconds to the tallest skyscraper in the Western Hemisphere.',
              duration: '2.0 hrs'
            }
          ]
        }
      ]
    },

    // === GOA ===
    'goa': {
      name: 'Goa',
      country: 'India',
      type: 'city',
      currency: 'INR',
      coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 3500,
      days: [
        {
          theme: 'North Goa Heritage Forts & Golden Coast',
          activities: [
            {
              name: 'Fort Aguada & Portuguese Lighthouse',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '11:30',
              cost: 100,
              location: 'Candolim, North Goa',
              image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
              notes: '17th-century Portuguese fortress overlooking the vast Arabian Sea. Great morning breeze and panoramic sea vistas.',
              duration: '2.5 hrs'
            },
            {
              name: 'Baga & Calangute Beachside Seafood Tasting',
              category: 'food',
              startTime: '12:00',
              endTime: '14:00',
              cost: 850,
              location: 'Baga Beach, North Goa',
              image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
              notes: 'Freshly prepared Goan prawn curry, butter garlic calamari, and chilled coconut water right on the beach.',
              duration: '2.0 hrs'
            },
            {
              name: 'Anjuna Flea Market & Cliff Promenade',
              category: 'shopping',
              startTime: '14:30',
              endTime: '17:30',
              cost: 400,
              location: 'Anjuna Beach, Goa',
              image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
              notes: 'Browse bohemian apparel, handcrafted silver jewelry, spices, and acoustic beach cafes.',
              duration: '3.0 hrs'
            },
            {
              name: 'Chapora Fort Sunset & Vagator Coastline',
              category: 'nightlife',
              startTime: '18:00',
              endTime: '21:00',
              cost: 1200,
              location: 'Chapora, Vagator',
              image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
              notes: 'Iconic clifftop ramparts with breathtaking 360-degree sunset views followed by beach shack dinner.',
              duration: '3.0 hrs'
            }
          ]
        },
        {
          theme: 'Old Goa Cathedrals & Tropical Spice Plantations',
          activities: [
            {
              name: 'Basilica of Bom Jesus & Se Cathedral',
              category: 'culture',
              startTime: '09:00',
              endTime: '11:30',
              cost: 50,
              location: 'Old Goa, Panaji',
              image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
              notes: 'UNESCO World Heritage site with baroque architecture and relics of St. Francis Xavier.',
              duration: '2.5 hrs'
            },
            {
              name: 'Sahakari Spice Farm Traditional Buffet',
              category: 'food',
              startTime: '12:30',
              endTime: '15:00',
              cost: 750,
              location: 'Ponda, Central Goa',
              image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
              notes: 'Guided spice plantation walk with vanilla, cardamom, and fresh betel nut, followed by organic Goan lunch.',
              duration: '2.5 hrs'
            },
            {
              name: 'Mandovi River Sunset Cruise & Folk Dance',
              category: 'nightlife',
              startTime: '17:30',
              endTime: '20:30',
              cost: 1000,
              location: 'Panaji Jetty, Mandovi River',
              image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
              notes: 'Cruise along the scenic Mandovi river with live Goan Dekhni and Fugdi folk performances.',
              duration: '3.0 hrs'
            }
          ]
        },
        {
          theme: 'South Goa Serenity & Palolem Crescent Bay',
          activities: [
            {
              name: 'Dudhsagar Four-Tiered Waterfalls Safari',
              category: 'adventure',
              startTime: '08:30',
              endTime: '13:00',
              cost: 1600,
              location: 'Bhagwan Mahavir Sanctuary',
              image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80',
              notes: 'Thrilling open-jeep jungle drive across forest streams to the roaring milk-white cascade.',
              duration: '4.5 hrs'
            },
            {
              name: 'Palolem Beach Sea Kayaking & Silent Noise',
              category: 'relax',
              startTime: '14:30',
              endTime: '17:30',
              cost: 600,
              location: 'Palolem, South Goa',
              image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
              notes: 'Calm turquoise crescent bay flanked by towering coconut groves. Perfect for swimming and paddle-boarding.',
              duration: '3.0 hrs'
            },
            {
              name: 'Candlelight Seafood Dinner by the Waves',
              category: 'food',
              startTime: '18:30',
              endTime: '21:30',
              cost: 1400,
              location: 'Palolem Beach Front',
              image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
              notes: 'Dine under fairy lights on the sand with grilled red snapper and chilled tropical beverages.',
              duration: '3.0 hrs'
            }
          ]
        }
      ]
    },

    // === DUBAI ===
    'dubai': {
      name: 'Dubai',
      country: 'UAE',
      type: 'city',
      currency: 'AED',
      coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 450,
      days: [
        {
          theme: 'Futuristic Skyscrapers & Burj District',
          activities: [
            {
              name: 'Burj Khalifa At the Top (124th & 125th Floors)',
              category: 'sightseeing',
              startTime: '09:30',
              endTime: '12:00',
              cost: 180,
              location: 'Downtown Dubai',
              image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
              notes: 'High-speed elevator to the world\'s tallest tower with panoramic desert, city, and gulf views.',
              duration: '2.5 hrs'
            },
            {
              name: 'Dubai Aquarium & Underwater Zoo',
              category: 'culture',
              startTime: '12:30',
              endTime: '14:30',
              cost: 120,
              location: 'Dubai Mall, Downtown',
              image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
              notes: 'Walk through the 48-meter acrylic tunnel surrounded by sand tiger sharks and giant stingrays.',
              duration: '2.0 hrs'
            },
            {
              name: 'Dubai Fountain & Souk Al Bahar Dinner',
              category: 'nightlife',
              startTime: '18:00',
              endTime: '21:00',
              cost: 190,
              location: 'Burj Lake, Downtown Dubai',
              image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80',
              notes: 'World-famous choreographed water, light, and music fountains with outdoor patio dining.',
              duration: '3.0 hrs'
            }
          ]
        },
        {
          theme: 'Golden Desert Dunes & Arabian Night Oasis',
          activities: [
            {
              name: 'Museum of the Future Interactive Exploration',
              category: 'culture',
              startTime: '10:00',
              endTime: '13:00',
              cost: 150,
              location: 'Sheikh Zayed Road, Trade Centre',
              image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
              notes: 'Torus-shaped architectural wonder showcasing future space travel, climate bio-vaults, and AI.',
              duration: '3.0 hrs'
            },
            {
              name: '4x4 Red Dune Bashing & Sandboarding',
              category: 'adventure',
              startTime: '15:00',
              endTime: '18:30',
              cost: 220,
              location: 'Lahbab High Red Dunes',
              image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=600&q=80',
              notes: 'Exciting desert rollercoaster ride over crimson dunes followed by sunset camel rides.',
              duration: '3.5 hrs'
            },
            {
              name: 'Bedouin Camp Barbecue Feast & Tanoura Show',
              category: 'food',
              startTime: '18:30',
              endTime: '21:30',
              cost: 120,
              location: 'Desert Camp Retreat',
              image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
              notes: 'Starlit Arabian banquet with grilled kebabs, henna painting, shisha, and live fire dancing.',
              duration: '3.0 hrs'
            }
          ]
        }
      ]
    },

    // === MANALI ===
    'manali': {
      name: 'Manali',
      country: 'India',
      type: 'city',
      currency: 'INR',
      coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 2800,
      days: [
        {
          theme: 'Alpine Forests & Old Manali Culture',
          activities: [
            {
              name: 'Hadimba Devi Temple & Ancient Cedar Grove',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '11:30',
              cost: 50,
              location: 'Dhungri Forest, Old Manali',
              image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
              notes: '1553 AD pagoda-style wooden temple built around a natural cave sanctuary amidst giant deodars.',
              duration: '2.5 hrs'
            },
            {
              name: 'Old Manali Riverfront Cafes & Fresh Trout',
              category: 'food',
              startTime: '12:00',
              endTime: '14:00',
              cost: 650,
              location: 'Manaslu River Road, Old Manali',
              image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
              notes: 'Woodfire pizza, Himalayan grilled trout, and freshly brewed apple cider beside the river.',
              duration: '2.0 hrs'
            },
            {
              name: 'Jogini Waterfalls Pine Forest Trek',
              category: 'adventure',
              startTime: '14:30',
              endTime: '17:30',
              cost: 200,
              location: 'Vashisht Village Trail',
              image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
              notes: 'Scenic 3km mountain walk through apple orchards and pine trees leading to cascading holy waterfalls.',
              duration: '3.0 hrs'
            },
            {
              name: 'Vashisht Natural Sulphur Hot Springs',
              category: 'relax',
              startTime: '18:00',
              endTime: '20:00',
              cost: 100,
              location: 'Vashisht Temple Complex',
              image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
              notes: 'Soak in the medicinal, mineral-rich hot natural baths overlooking the Beas valley at dusk.',
              duration: '2.0 hrs'
            }
          ]
        },
        {
          theme: 'Snow Peaks & Solang Valley Adventure',
          activities: [
            {
              name: 'Solang Valley Ropeway Gondola & Paragliding',
              category: 'adventure',
              startTime: '09:00',
              endTime: '13:00',
              cost: 2400,
              location: 'Solang Valley Adventure Arena',
              image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
              notes: 'Tandem paragliding flight soaring over snow-capped glaciers and pine forests.',
              duration: '4.0 hrs'
            },
            {
              name: 'Atal Tunnel Engineering Marvel & Sissu Lake',
              category: 'sightseeing',
              startTime: '13:30',
              endTime: '17:30',
              cost: 700,
              location: 'North Portal, Lahaul Valley',
              image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
              notes: 'Drive through the world\'s longest highway tunnel above 10,000 feet to dramatic Himalayan cliffs.',
              duration: '4.0 hrs'
            },
            {
              name: 'Mall Road Evening Stroll & Tibetan Momos',
              category: 'food',
              startTime: '18:30',
              endTime: '21:00',
              cost: 500,
              location: 'The Mall, Manali Centre',
              image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
              notes: 'Bustling pedestrian street with warm woolens, hot chocolate, and authentic steamed thukpa.',
              duration: '2.5 hrs'
            }
          ]
        }
      ]
    },

    // === JAIPUR ===
    'jaipur': {
      name: 'Jaipur',
      country: 'India',
      type: 'city',
      currency: 'INR',
      coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 3200,
      days: [
        {
          theme: 'Royal Citadels & The Pink City Grandeur',
          activities: [
            {
              name: 'Hawa Mahal (Palace of Winds)',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '10:30',
              cost: 100,
              location: 'Badi Choupad, Pink City',
              image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
              notes: 'Fascinating 5-story pink sandstone facade featuring 953 ornate honeycomb jharokha windows.',
              duration: '1.5 hrs'
            },
            {
              name: 'City Palace & Jantar Mantar Observatory',
              category: 'culture',
              startTime: '11:00',
              endTime: '13:30',
              cost: 350,
              location: 'Gangori Bazaar, Jaipur',
              image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80',
              notes: 'Royal courtyards, Peacock Gate, and the world\'s largest stone sundial built in 1734.',
              duration: '2.5 hrs'
            },
            {
              name: 'Traditional Dal Baati Churma Feast',
              category: 'food',
              startTime: '13:30',
              endTime: '15:00',
              cost: 650,
              location: 'Johari Bazaar',
              image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
              notes: 'Authentic royal Rajasthani thali with pure ghee, gatte ki sabzi, and saffron lassi.',
              duration: '1.5 hrs'
            },
            {
              name: 'Amber Fort Elephant Trail & Sheesh Mahal',
              category: 'sightseeing',
              startTime: '15:30',
              endTime: '18:30',
              cost: 500,
              location: 'Devisinghpura, Amer',
              image: 'https://images.unsplash.com/photo-1603258849040-779d714b10b3?auto=format&fit=crop&w=600&q=80',
              notes: 'Majestic fortress overlooking Maota Lake with the world-famous Palace of Mirrors.',
              duration: '3.0 hrs'
            }
          ]
        },
        {
          theme: 'Fortress Ridges & Folk Heritage',
          activities: [
            {
              name: 'Nahargarh Fort Sunrise & Tiger Ridge',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '12:00',
              cost: 150,
              location: 'Aravalli Hills, Jaipur',
              image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
              notes: 'Panoramic ramparts high above the Pink City with royal suites in the Madhavendra Bhawan.',
              duration: '3.0 hrs'
            },
            {
              name: 'Jal Mahal (Water Palace) & Blue Pottery',
              category: 'shopping',
              startTime: '13:00',
              endTime: '15:30',
              cost: 400,
              location: 'Amer Road, Man Sagar Lake',
              image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80',
              notes: 'Palace floating in the lake and artisan workshops creating traditional turquoise ceramic wares.',
              duration: '2.5 hrs'
            },
            {
              name: 'Chokhi Dhani Ethnic Resort & Folk Dance',
              category: 'nightlife',
              startTime: '17:30',
              endTime: '21:30',
              cost: 1200,
              location: 'Tonk Road, Jaipur',
              image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
              notes: 'Authentic Rajasthani village fair with camel rides, fire dancers, puppet theatre, and royal dining.',
              duration: '4.0 hrs'
            }
          ]
        }
      ]
    },

    // === KERALA ===
    'kerala': {
      name: 'Kerala',
      country: 'India',
      type: 'city',
      currency: 'INR',
      coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 3600,
      days: [
        {
          theme: 'Emerald Backwaters & Serene Houseboats',
          activities: [
            {
              name: 'Alleppey Backwaters Houseboat Cruise',
              category: 'relax',
              startTime: '09:00',
              endTime: '14:00',
              cost: 2500,
              location: 'Punnamada Jetty, Alleppey',
              image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
              notes: 'Glide along tranquil palm-fringed canals on a traditional thatched-roof Kettuvallam.',
              duration: '5.0 hrs'
            },
            {
              name: 'Karimeen Pollichathu & Toddy Shop Tasting',
              category: 'food',
              startTime: '14:30',
              endTime: '16:30',
              cost: 650,
              location: 'Kuttanad, Alleppey',
              image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
              notes: 'Pearl spot fish marinated in shallots and ginger, wrapped in banana leaf and pan-roasted.',
              duration: '2.0 hrs'
            },
            {
              name: 'Marari Beach Sunset & Ayurvedic Herbal Spa',
              category: 'relax',
              startTime: '17:30',
              endTime: '20:30',
              cost: 1400,
              location: 'Mararikulam, Alappuzha',
              image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
              notes: 'Secluded coconut palm beach followed by authentic Ayurvedic Abhyanga full-body warm oil massage.',
              duration: '3.0 hrs'
            }
          ]
        }
      ]
    },

    // === LONDON ===
    'london': {
      name: 'London',
      country: 'United Kingdom',
      type: 'city',
      currency: 'GBP',
      coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 150,
      days: [
        {
          theme: 'Royal Westminster & The River Thames',
          activities: [
            {
              name: 'Big Ben & Palace of Westminster',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '11:00',
              cost: 25,
              location: 'Westminster, London',
              image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
              notes: 'Iconic neo-gothic clock tower and Houses of Parliament across Westminster Bridge.',
              duration: '2.0 hrs'
            },
            {
              name: 'Borough Market Artisan Food Exploration',
              category: 'food',
              startTime: '11:30',
              endTime: '13:30',
              cost: 30,
              location: 'Southwark, London Bridge',
              image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
              notes: 'Historic 1,000-year-old food market with hot salt beef bagels, truffle pasta, and English cheeses.',
              duration: '2.0 hrs'
            },
            {
              name: 'Tower Bridge Walk & Tower of London',
              category: 'culture',
              startTime: '14:00',
              endTime: '17:00',
              cost: 33,
              location: 'Tower Hill, London',
              image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=600&q=80',
              notes: 'Historic Norman fortress housing the Crown Jewels and the glass-floor high walkway on Tower Bridge.',
              duration: '3.0 hrs'
            },
            {
              name: 'London Eye Flight & South Bank Sunset Dinner',
              category: 'sightseeing',
              startTime: '18:00',
              endTime: '21:00',
              cost: 45,
              location: 'Riverside Building, South Bank',
              image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=600&q=80',
              notes: 'Giant observation wheel with 360-degree twilight views over the London skyline.',
              duration: '3.0 hrs'
            }
          ]
        }
      ]
    },

    // === SINGAPORE ===
    'singapore': {
      name: 'Singapore',
      country: 'Singapore',
      type: 'city',
      currency: 'SGD',
      coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 170,
      days: [
        {
          theme: 'Gardens in the Sky & Marina Bay',
          activities: [
            {
              name: 'Gardens by the Bay & Cloud Forest Dome',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '12:00',
              cost: 35,
              location: 'Marina Gardens Drive',
              image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
              notes: 'World\'s largest glass greenhouse with a 35-meter indoor waterfall and exotic mist mountain.',
              duration: '3.0 hrs'
            },
            {
              name: 'Maxwell Food Centre Hainanese Chicken Rice',
              category: 'food',
              startTime: '12:30',
              endTime: '14:00',
              cost: 15,
              location: 'Chinatown, Singapore',
              image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
              notes: 'World-renowned Michelin-featured Tian Tian Chicken Rice and sugar cane juice.',
              duration: '1.5 hrs'
            },
            {
              name: 'Marina Bay Sands SkyPark Observation Deck',
              category: 'sightseeing',
              startTime: '15:00',
              endTime: '17:30',
              cost: 32,
              location: '10 Bayfront Ave',
              image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=600&q=80',
              notes: '57 stories high atop the three hotel towers with sweeping vistas across the Singapore Strait.',
              duration: '2.5 hrs'
            },
            {
              name: 'Supertree Grove Garden Rhapsody Light Show',
              category: 'nightlife',
              startTime: '18:30',
              endTime: '21:00',
              cost: 20,
              location: 'Gardens by the Bay',
              image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
              notes: 'Dazzling musical light extravaganza illuminating the giant 50-meter vertical gardens.',
              duration: '2.5 hrs'
            }
          ]
        }
      ]
    },

    // === NEW YORK ===
    'new york': {
      name: 'New York City',
      country: 'United States',
      type: 'city',
      currency: 'USD',
      coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 220,
      days: [
        {
          theme: 'Manhattan Icons, Central Park & Broadway',
          activities: [
            {
              name: 'Central Park Walk & Bow Bridge',
              category: 'adventure',
              startTime: '09:00',
              endTime: '11:30',
              cost: 15,
              location: 'Central Park, Manhattan',
              image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80',
              notes: 'Stroll through Strawberry Fields, Bethesda Terrace, and the historic iron-cast Bow Bridge.',
              duration: '2.5 hrs'
            },
            {
              name: 'Pastrami on Rye at Legendary Deli',
              category: 'food',
              startTime: '12:00',
              endTime: '13:45',
              cost: 32,
              location: 'Lower East Side, NYC',
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
              notes: 'Famous towering hot pastrami on rye with sour pickles and egg creams.',
              duration: '1.75 hrs'
            },
            {
              name: 'Top of the Rock Observation Deck',
              category: 'sightseeing',
              startTime: '14:30',
              endTime: '17:00',
              cost: 44,
              location: 'Rockefeller Center, Manhattan',
              image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
              notes: 'Unrivaled 360-degree skyline views of the Empire State Building and Central Park.',
              duration: '2.5 hrs'
            },
            {
              name: 'Times Square Neon & Broadway Musical',
              category: 'nightlife',
              startTime: '18:30',
              endTime: '21:30',
              cost: 110,
              location: 'Broadway Theater District',
              image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
              notes: 'Immerse in the electric energy of Times Square billboards and an award-winning Broadway production.',
              duration: '3.0 hrs'
            }
          ]
        },
        {
          theme: 'Statue of Liberty, High Line & Chelsea Market',
          activities: [
            {
              name: 'Statue of Liberty & Ellis Island Ferry',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '12:00',
              cost: 30,
              location: 'Battery Park Ferry Terminal',
              image: 'https://images.unsplash.com/photo-1503572327579-b5c6afe5c5c5?auto=format&fit=crop&w=600&q=80',
              notes: 'Cruise past Liberty Island and explore the historic National Immigration Museum on Ellis Island.',
              duration: '3.0 hrs'
            },
            {
              name: 'Chelsea Market Lobster Roll & Artisanal Bakeries',
              category: 'food',
              startTime: '12:30',
              endTime: '14:15',
              cost: 38,
              location: 'Chelsea Market, 9th Ave',
              image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
              notes: 'Indoor culinary concourse housed in the historic Nabisco factory.',
              duration: '1.75 hrs'
            },
            {
              name: 'The High Line Elevated Park & Hudson Yards',
              category: 'adventure',
              startTime: '14:45',
              endTime: '17:15',
              cost: 10,
              location: 'Gansevoort St to 34th St',
              image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
              notes: '1.45-mile-long elevated linear rail park brimming with contemporary outdoor sculptures.',
              duration: '2.5 hrs'
            },
            {
              name: 'Greenwich Village Jazz Club & Craft Cocktails',
              category: 'nightlife',
              startTime: '18:30',
              endTime: '21:30',
              cost: 45,
              location: 'Greenwich Village, Manhattan',
              image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
              notes: 'Intimate subterranean jazz club with legendary live quartets and signature bourbon cocktails.',
              duration: '3.0 hrs'
            }
          ]
        },
        {
          theme: 'Brooklyn Bridge, DUMBO Waterfront & Soho Boutiques',
          activities: [
            {
              name: 'Brooklyn Bridge Sunrise Walk to DUMBO',
              category: 'sightseeing',
              startTime: '09:00',
              endTime: '11:30',
              cost: 10,
              location: 'Brooklyn Bridge Pedestrian Promenade',
              image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
              notes: 'Walk across the iconic 1883 suspension bridge with spectacular views of lower Manhattan.',
              duration: '2.5 hrs'
            },
            {
              name: 'DUMBO Brick-Oven Pizza & Brooklyn Bridge Park',
              category: 'food',
              startTime: '12:00',
              endTime: '13:45',
              cost: 30,
              location: 'Front St, DUMBO Brooklyn',
              image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
              notes: 'Coal-fired crispy thin crust pizza enjoyed on the East River promenade overlooking Manhattan skyline.',
              duration: '1.75 hrs'
            },
            {
              name: 'SoHo Cast-Iron Architecture & Designer Flagships',
              category: 'shopping',
              startTime: '14:30',
              endTime: '17:30',
              cost: 25,
              location: 'Broadway & Spring St, SoHo',
              image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
              notes: 'Cobblestone streets lined with ornate 19th-century cast-iron buildings and independent galleries.',
              duration: '3.0 hrs'
            },
            {
              name: 'DUMBO Sunset Carousel & Waterfront Lounge',
              category: 'nightlife',
              startTime: '18:30',
              endTime: '21:00',
              cost: 40,
              location: 'Jane\'s Carousel, Brooklyn',
              image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
              notes: 'Cocktails overlooking the glowing financial district towers and illuminated Manhattan Bridge.',
              duration: '2.5 hrs'
            }
          ]
        }
      ]
    }
  },

  // Country-level routing knowledge: splits duration across key regions
  countries: {
    'india': {
      name: 'India',
      currency: 'INR',
      coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 3200,
      hubs: [
        { city: 'Jaipur', share: 0.35 },
        { city: 'Goa', share: 0.35 },
        { city: 'Manali', share: 0.30 }
      ]
    },
    'japan': {
      name: 'Japan',
      currency: 'JPY',
      coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 155,
      hubs: [
        { city: 'Tokyo', share: 0.55 },
        { city: 'Kyoto', share: 0.45 }
      ]
    },
    'france': {
      name: 'France',
      currency: 'EUR',
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 175,
      hubs: [
        { city: 'Paris', share: 0.70 },
        { city: 'Versailles & Riviera', share: 0.30 }
      ]
    },
    'italy': {
      name: 'Italy',
      currency: 'EUR',
      coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 150,
      hubs: [
        { city: 'Rome', share: 0.60 },
        { city: 'Florence & Venice', share: 0.40 }
      ]
    },
    'switzerland': {
      name: 'Switzerland',
      currency: 'CHF',
      coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 240,
      hubs: [
        { city: 'Interlaken & Alps', share: 0.50 },
        { city: 'Zurich & Lucerne', share: 0.50 }
      ]
    },
    'united states': {
      name: 'United States',
      currency: 'USD',
      coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 250,
      hubs: [
        { city: 'New York City', share: 0.60 },
        { city: 'San Francisco', share: 0.40 }
      ]
    },
    'indonesia': {
      name: 'Indonesia',
      currency: 'USD',
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 75,
      hubs: [
        { city: 'Ubud, Bali', share: 0.50 },
        { city: 'Seminyak & Coastal Bali', share: 0.50 }
      ]
    },
    'spain': {
      name: 'Spain',
      currency: 'EUR',
      coverImage: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 160,
      hubs: [
        { city: 'Barcelona', share: 0.50 },
        { city: 'Madrid & Seville', share: 0.50 }
      ]
    },
    'united kingdom': {
      name: 'United Kingdom',
      currency: 'GBP',
      coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 190,
      hubs: [
        { city: 'London', share: 0.60 },
        { city: 'Edinburgh & Scottish Highlands', share: 0.40 }
      ]
    },
    'germany': {
      name: 'Germany',
      currency: 'EUR',
      coverImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 170,
      hubs: [
        { city: 'Berlin', share: 0.50 },
        { city: 'Munich & Bavaria', share: 0.50 }
      ]
    },
    'thailand': {
      name: 'Thailand',
      currency: 'THB',
      coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 65,
      hubs: [
        { city: 'Bangkok', share: 0.50 },
        { city: 'Chiang Mai & Phuket', share: 0.50 }
      ]
    },
    'greece': {
      name: 'Greece',
      currency: 'EUR',
      coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 155,
      hubs: [
        { city: 'Athens', share: 0.40 },
        { city: 'Santorini & Mykonos', share: 0.60 }
      ]
    },
    'australia': {
      name: 'Australia',
      currency: 'AUD',
      coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 210,
      hubs: [
        { city: 'Sydney', share: 0.55 },
        { city: 'Melbourne', share: 0.45 }
      ]
    },
    'united arab emirates': {
      name: 'United Arab Emirates',
      currency: 'AED',
      coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      dailyBudget: 240,
      hubs: [
        { city: 'Dubai', share: 0.70 },
        { city: 'Abu Dhabi', share: 0.30 }
      ]
    }
  },

  _formatDate(d) {
    if (!d) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Main Generator Entry Point
   * @param {string} destination - City or country name
   * @param {number} durationDays - Integer number of days (e.g. 1 to 14)
   * @param {string} startDate - Start date YYYY-MM-DD
   * @param {object} options - Optional preferences (travelStyle, pacing)
   */
  generate(destination, durationDays = 5, startDate = null, options = {}) {
    const cleanDest = (destination || 'Paris').trim().toLowerCase();
    const daysCount = Math.max(1, Math.min(30, parseInt(durationDays, 10) || 5));

    // Base start date if not supplied (use local timezone dates to avoid UTC offset shifts)
    let currentDate;
    if (startDate) {
      if (typeof startDate === 'string' && startDate.includes('-')) {
        const parts = startDate.split('-').map(Number);
        currentDate = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        currentDate = new Date(startDate);
      }
    } else {
      currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1); // Tomorrow
    }

    // Check if matching city exists (including NYC alias)
    let matchedCityKey = Object.keys(this.destinations).find(k => 
      cleanDest.includes(k) || k.includes(cleanDest) || (cleanDest === 'nyc' && k === 'new york')
    );

    // Check if matching country exists (including common aliases)
    let matchedCountryKey = Object.keys(this.countries).find(k => 
      cleanDest.includes(k) || k.includes(cleanDest) ||
      (cleanDest === 'uk' && k === 'united kingdom') ||
      (cleanDest === 'uae' && k === 'united arab emirates') ||
      (cleanDest === 'usa' && k === 'united states') ||
      (cleanDest === 'us' && k === 'united states')
    );

    let generatedDays = [];
    let primaryCover = CONFIG.COVER_PRESETS[0].url;
    let tripCurrency = 'USD';
    let estDailyCost = 150;

    if (matchedCityKey) {
      const cityData = this.destinations[matchedCityKey];
      primaryCover = cityData.coverImage;
      tripCurrency = cityData.currency;
      estDailyCost = cityData.dailyBudget;

      generatedDays = this._buildCityDays(cityData, daysCount, currentDate);
    } else if (matchedCountryKey) {
      const countryData = this.countries[matchedCountryKey];
      primaryCover = countryData.coverImage;
      tripCurrency = countryData.currency;
      estDailyCost = countryData.dailyBudget;

      generatedDays = this._buildCountryDays(countryData, daysCount, currentDate);
    } else {
      // Fallback: Smart Procedural Generation for ANY custom destination
      const procedural = this._generateProceduralItinerary(destination, daysCount, currentDate);
      generatedDays = procedural.days;
      primaryCover = procedural.coverImage;
      tripCurrency = 'USD';
      estDailyCost = 160;
    }

    // Compute end date
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + daysCount - 1);

    const calculatedBudget = Math.round(estDailyCost * daysCount * 1.15);

    const formatDestName = (str) => {
      if (!str || typeof str !== 'string') return '';
      if (typeof Utils !== 'undefined' && typeof Utils.capitalize === 'function') {
        return Utils.capitalize(str);
      }
      return str.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
    };

    return {
      destination: formatDestName(destination),
      durationDays: daysCount,
      startDate: this._formatDate(currentDate),
      endDate: this._formatDate(endDate),
      budget: calculatedBudget,
      currency: tripCurrency,
      coverImage: primaryCover,
      days: generatedDays
    };
  },

  _buildCityDays(cityData, totalDays, startDate) {
    const days = [];
    const pool = cityData.days;

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayNumber = i + 1;

      let activities = [];
      let dayTheme = '';

      if (i < pool.length) {
        // Use curated day
        const templateDay = pool[i];
        dayTheme = templateDay.theme || `Day ${dayNumber}: Highlights of ${cityData.name}`;
        activities = templateDay.activities.map((act, actIdx) => ({
          ...act,
          id: `act-${dayNumber}-${actIdx + 1}-${Date.now()}`
        }));
      } else {
        // Dynamically synthesize unique extension days for longer stays
        const extensionThemes = [
          `Hidden Courtyards & Artisan Cafés in ${cityData.name}`,
          `Scenic Day Excursion & Natural Vistas from ${cityData.name}`,
          `Local Gourmet Markets & Secret Neighborhoods in ${cityData.name}`,
          `Contemporary Art Galleries & Waterfront Promenade`,
          `Historic Architecture & Panoramic Sunset Terrace`,
          `Boutique Shopping, Artisan Crafts & Farewell Dinner`
        ];
        const extIdx = i - pool.length;
        dayTheme = `Day ${dayNumber}: ${extensionThemes[extIdx % extensionThemes.length]}`;
        activities = this._getProceduralActivitiesForCity(cityData.name, dayNumber);
      }

      days.push({
        dayNumber: dayNumber,
        date: this._formatDate(date),
        city: cityData.name,
        theme: dayTheme,
        activities: activities
      });
    }
    return days;
  },

  _buildCountryDays(countryData, totalDays, startDate) {
    const days = [];
    let currentDayIndex = 0;

    countryData.hubs.forEach((hub, hubIdx) => {
      // Allocate days according to hub share
      let hubDays = Math.round(totalDays * hub.share);
      if (hubIdx === countryData.hubs.length - 1) {
        // Last hub gets whatever remaining days
        hubDays = totalDays - currentDayIndex;
      }
      hubDays = Math.max(1, hubDays);

      // Check if hub city has a detailed profile
      const hubKey = Object.keys(this.destinations).find(k => hub.city.toLowerCase().includes(k));
      const pool = hubKey ? this.destinations[hubKey].days : null;

      for (let j = 0; j < hubDays; j++) {
        if (currentDayIndex >= totalDays) break;

        const date = new Date(startDate);
        date.setDate(startDate.getDate() + currentDayIndex);
        const dayNumber = currentDayIndex + 1;

        let dayActivities = [];
        let dayTheme = `Day ${dayNumber}: Discovering ${hub.city}`;

        if (pool && j < pool.length) {
          const tmpl = pool[j];
          dayTheme = tmpl.theme;
          dayActivities = tmpl.activities.map((act, actIdx) => ({
            ...act,
            id: `act-${dayNumber}-${actIdx + 1}-${Date.now()}`
          }));
        } else {
          dayActivities = this._getProceduralActivitiesForCity(hub.city, dayNumber);
        }

        days.push({
          dayNumber: dayNumber,
          date: this._formatDate(date),
          city: hub.city,
          theme: dayTheme,
          activities: dayActivities
        });

        currentDayIndex++;
      }
    });

    // Ensure total requested days are filled if rounding left gaps
    while (currentDayIndex < totalDays) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + currentDayIndex);
      const dayNumber = currentDayIndex + 1;
      const fallbackHub = countryData.hubs[0]?.city || countryData.name;

      days.push({
        dayNumber: dayNumber,
        date: this._formatDate(date),
        city: fallbackHub,
        theme: `Day ${dayNumber}: Highlights of ${fallbackHub}`,
        activities: this._getProceduralActivitiesForCity(fallbackHub, dayNumber)
      });
      currentDayIndex++;
    }

    return days;
  },

  _generateProceduralItinerary(destName, totalDays, startDate) {
    const clean = (typeof Utils !== 'undefined' && typeof Utils.capitalize === 'function')
      ? Utils.capitalize(destName)
      : (destName ? destName.charAt(0).toUpperCase() + destName.slice(1) : 'Destination');
    const coverPhotos = [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ];

    const days = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayNum = i + 1;

      days.push({
        dayNumber: dayNum,
        date: this._formatDate(date),
        city: clean,
        theme: `Day ${dayNum}: ${this._getProceduralTheme(i, clean)}`,
        activities: this._getProceduralActivitiesForCity(clean, dayNum)
      });
    }

    return {
      coverImage: coverPhotos[0],
      days: days
    };
  },

  _getProceduralTheme(dayIndex, dest) {
    const themes = [
      `Historic Old Quarter & Iconic Sights`,
      `Cultural Immersion & Local Flavors`,
      `Nature Vistas & Panoramic Horizons`,
      `Artisan Markets & Hidden Gems`,
      `Scenic Coastal / Mountain Excursion`,
      `Gastronomic Trail & Sunset Dinner`,
      `Leisure, Boutiques & Farewell Evening`
    ];
    return themes[dayIndex % themes.length];
  },

  _getProceduralActivitiesForCity(city, dayNum) {
    const daySets = [
      // Set 1: Historic Old Town & Core Landmarks
      [
        {
          name: `${city} Historic Old Town & Landmark Heritage Walk`,
          category: 'sightseeing',
          startTime: '09:00',
          endTime: '11:30',
          cost: 20,
          location: `Central ${city}`,
          image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
          notes: `Morning walking tour around the most celebrated monuments, historic plazas, and architectural landmarks of ${city}.`,
          duration: '2.5 hrs'
        },
        {
          name: `Traditional ${city} Bistro & Artisan Culinary Tasting`,
          category: 'food',
          startTime: '12:00',
          endTime: '13:45',
          cost: 35,
          location: `Old Quarter, ${city}`,
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
          notes: `Sample beloved local specialties and freshly prepared heritage recipes by celebrated regional chefs.`,
          duration: '1.75 hrs'
        },
        {
          name: `${city} National Museum of History & Fine Art`,
          category: 'culture',
          startTime: '14:30',
          endTime: '17:00',
          cost: 25,
          location: `Cultural District, ${city}`,
          image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
          notes: `Curated gallery walk featuring regional archaeological discoveries, classic paintings, and sculpture gardens.`,
          duration: '2.5 hrs'
        },
        {
          name: `Panoramic Sunset Rooftop & Evening Skyline Dinner`,
          category: 'nightlife',
          startTime: '18:30',
          endTime: '21:00',
          cost: 55,
          location: `Skyline Promenade, ${city}`,
          image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
          notes: `Watch city lights illuminate at dusk with signature beverages and panoramic views over ${city}.`,
          duration: '2.5 hrs'
        }
      ],
      // Set 2: Nature, Local Markets & Craft Heritage
      [
        {
          name: `${city} Botanical Sanctuary & Scenic Greenways`,
          category: 'adventure',
          startTime: '09:00',
          endTime: '11:15',
          cost: 15,
          location: `Grand Parks, ${city}`,
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
          notes: `Peaceful nature trails winding past ornate greenhouses, lily ponds, and exotic flora.`,
          duration: '2.25 hrs'
        },
        {
          name: `Lively Farmers Market & Street Food Safari`,
          category: 'food',
          startTime: '11:45',
          endTime: '13:30',
          cost: 25,
          location: `Market Square, ${city}`,
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
          notes: `Vibrant market stalls serving freshly pressed juices, artisan cheeses, warm pastries, and skewers.`,
          duration: '1.75 hrs'
        },
        {
          name: `${city} Artisan Craft Quarters & Designer Boutiques`,
          category: 'shopping',
          startTime: '14:00',
          endTime: '17:00',
          cost: 30,
          location: `Artisans Row, ${city}`,
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
          notes: `Explore independent workshops featuring hand-blown glassware, bespoke textiles, and handcrafted leather.`,
          duration: '3.0 hrs'
        },
        {
          name: `Atmospheric Historic Tavern & Acoustic Live Music`,
          category: 'nightlife',
          startTime: '18:30',
          endTime: '21:30',
          cost: 45,
          location: `Lantern Alley, ${city}`,
          image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
          notes: `Cozy candlelit venue offering regional craft brews, hearty dinner boards, and acoustic musicians.`,
          duration: '3.0 hrs'
        }
      ],
      // Set 3: Waterfronts, Islands & Scenic Lookouts
      [
        {
          name: `${city} Scenic River or Harbor Cruise`,
          category: 'sightseeing',
          startTime: '09:30',
          endTime: '11:45',
          cost: 28,
          location: `Waterfront Pier, ${city}`,
          image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=600&q=80',
          notes: `Narrated cruise gliding past iconic bridges, maritime monuments, and waterfront promenades.`,
          duration: '2.25 hrs'
        },
        {
          name: `Harbor Seafood Grill & Coastal Dining`,
          category: 'food',
          startTime: '12:15',
          endTime: '14:00',
          cost: 40,
          location: `Marina Boardwalk, ${city}`,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
          notes: `Catch-of-the-day grilled seafood and crisp salads with unobstructed waterfront vistas.`,
          duration: '1.75 hrs'
        },
        {
          name: `${city} Contemporary Center for Modern Arts`,
          category: 'culture',
          startTime: '14:30',
          endTime: '17:00',
          cost: 22,
          location: `Arts District, ${city}`,
          image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
          notes: `Cutting-edge immersive digital installations, interactive galleries, and outdoor architectural sculptures.`,
          duration: '2.5 hrs'
        },
        {
          name: `Illuminated Waterfront Promenade & Night Market`,
          category: 'nightlife',
          startTime: '18:30',
          endTime: '21:00',
          cost: 35,
          location: `Bayside Boulevard, ${city}`,
          image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
          notes: `Stroll along twinkling harbor lights with dessert crepes, coffee roasters, and lively night street performers.`,
          duration: '2.5 hrs'
        }
      ],
      // Set 4: Mountain / Hillside Excursion & Castle Vistas
      [
        {
          name: `${city} Hilltop Citadel & Panoramic Lookout`,
          category: 'sightseeing',
          startTime: '09:00',
          endTime: '11:45',
          cost: 24,
          location: `Castle Hill, ${city}`,
          image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
          notes: `Ascend to the highest fortress vantage point overlooking the entire red-roofed panorama and valleys.`,
          duration: '2.75 hrs'
        },
        {
          name: `Rustic Countryside Inn & Hearth Cooked Stews`,
          category: 'food',
          startTime: '12:15',
          endTime: '14:00',
          cost: 30,
          location: `Upper Terraces, ${city}`,
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
          notes: `Hearty wood-fired oven breads, seasonal soups, and locally cured charcuterie.`,
          duration: '1.75 hrs'
        },
        {
          name: `Royal Palace Gardens & Reflecting Pools`,
          category: 'culture',
          startTime: '14:30',
          endTime: '17:00',
          cost: 20,
          location: `Palace Grounds, ${city}`,
          image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
          notes: `Manicured French or Italianate gardens, ornate stone fountains, and ancient labyrinth hedges.`,
          duration: '2.5 hrs'
        },
        {
          name: `Starlight Terrace & Signature Wine Tasting`,
          category: 'nightlife',
          startTime: '18:30',
          endTime: '21:15',
          cost: 50,
          location: `Upper Vineyard, ${city}`,
          image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
          notes: `Sommelier-guided tasting of regional vintages paired with artisanal cheeses under open evening stars.`,
          duration: '2.75 hrs'
        }
      ],
      // Set 5: Secret Quarters & Grand Farewell
      [
        {
          name: `${city} Secret Courtyards & Historic Cloisters`,
          category: 'sightseeing',
          startTime: '09:00',
          endTime: '11:30',
          cost: 15,
          location: `Monastery District, ${city}`,
          image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
          notes: `Tranquil hidden courtyards shielded from bustling streets, featuring carved arches and quiet sunlit gardens.`,
          duration: '2.5 hrs'
        },
        {
          name: `Historic Grand Cafe & Patisserie Heritage`,
          category: 'food',
          startTime: '12:00',
          endTime: '13:45',
          cost: 28,
          location: `Central Avenue, ${city}`,
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
          notes: `Velveteen banquettes, gilded mirrors, hot chocolate, and signature layered pastries.`,
          duration: '1.75 hrs'
        },
        {
          name: `${city} Souvenir Arcade & Vintage Bookstalls`,
          category: 'shopping',
          startTime: '14:15',
          endTime: '17:00',
          cost: 25,
          location: `Embankment Bookshops, ${city}`,
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
          notes: `Pick up nostalgic vintage travel posters, antique postcards, maps, and handcrafted mementos.`,
          duration: '2.75 hrs'
        },
        {
          name: `Grand Farewell Gala Dinner & City Lights Celebration`,
          category: 'nightlife',
          startTime: '18:30',
          endTime: '21:45',
          cost: 65,
          location: `Grand Ballroom & Terrace, ${city}`,
          image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
          notes: `Multi-course celebratory banquet honoring an unforgettable journey across ${city}.`,
          duration: '3.25 hrs'
        }
      ]
    ];

    const setIndex = (dayNum - 1) % daySets.length;
    const templateSet = daySets[setIndex];

    return templateSet.map((t, idx) => ({
      ...t,
      id: `act-${dayNum}-${idx + 1}-${Date.now()}`
    }));
  }
};

window.ItineraryGenerator = ItineraryGenerator;
