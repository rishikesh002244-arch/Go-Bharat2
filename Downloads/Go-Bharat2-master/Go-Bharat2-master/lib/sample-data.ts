export interface PlaceItem {
  id?: string;
  name: string;
  state: string;
  region: string;
  category: "Heritage" | "Nature" | "Beach" | "Spiritual" | "Hill Station" | "Adventure";
  description: string;
  image: string;
  rating: number;
  bestTimeToVisit: string;
  highlights: string[];
  entryFee: string;
  timings: string;
}

export interface HotelItem {
  id?: string;
  name: string;
  destination: string;
  state: string;
  pricePerNight: number;
  budgetTier: "Budget" | "Moderate" | "Luxury";
  rating: number;
  reviewsCount: number;
  amenities: string[];
  image: string;
  address: string;
  bookingUrl: string;
}

export interface FoodItem {
  id?: string;
  name: string;
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast";
  state: string;
  type: "Vegetarian" | "Non-Vegetarian" | "Street Food" | "Dessert" | "Beverage";
  description: string;
  image: string;
  famousIn: string;
  priceRange: string;
  flavorProfile: string;
}

export interface CultureItem {
  id?: string;
  title: string;
  state: string;
  region: string;
  type: "Festival" | "Dance & Art" | "Music" | "Architecture" | "Tradition";
  description: string;
  image: string;
  season: string;
  significance: string;
}

export const samplePlaces: PlaceItem[] = [
  {
    name: "Taj Mahal",
    state: "Uttar Pradesh",
    region: "North",
    category: "Heritage",
    description: "An ivory-white marble mausoleum on the south bank of the Yamuna river, widely considered one of the wonders of the world and a testament of eternal love.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    bestTimeToVisit: "October to March",
    highlights: ["Mughal Architecture", "Yamuna Riverfront", "UNESCO World Heritage"],
    entryFee: "₹50 for Indians, ₹1100 for Foreigners",
    timings: "Sunrise to Sunset (Closed Fridays)",
  },
  {
    name: "Pangong Tso Lake",
    state: "Ladakh",
    region: "North",
    category: "Nature",
    description: "A high-altitude endorheic lake nestled at 14,270 ft in the Himalayas, famous for changing colors from azure to light blue and emerald green throughout the day.",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    bestTimeToVisit: "May to September",
    highlights: ["Color Changing Water", "Himalayan Vistas", "Stargazing"],
    entryFee: "Inner Line Permit required (~₹400)",
    timings: "Open 24 hours (Daylight travel recommended)",
  },
  {
    name: "Solang Valley",
    state: "Himachal Pradesh",
    region: "North",
    category: "Adventure",
    description: "A scenic valley near Manali famous for paragliding, zorbing, and snow activities, framed by pine forests and snow-capped peaks of the Pir Panjal range.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d6370a76?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    bestTimeToVisit: "December to June",
    highlights: ["Paragliding", "Snow Sports", "Mountain Views"],
    entryFee: "Activity charges vary",
    timings: "8:00 AM – 5:00 PM",
  },
  {
    name: "Hadimba Devi Temple",
    state: "Himachal Pradesh",
    region: "North",
    category: "Spiritual",
    description: "A unique wooden pagoda temple in Manali dedicated to Goddess Hadimba, set amid a dense cedar forest and dating back to 1553.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    bestTimeToVisit: "March to June, October to November",
    highlights: ["Cedar Forest", "Wooden Architecture", "Local Legends"],
    entryFee: "Free (donations welcome)",
    timings: "8:00 AM – 6:00 PM",
  },
  {
    name: "Alleppey Backwaters",
    state: "Kerala",
    region: "South",
    category: "Nature",
    description: "Known as the Venice of the East, featuring a labyrinthine network of tranquil canals, lagoons, and traditional thatched houseboats navigating lush paddy fields.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    bestTimeToVisit: "September to March",
    highlights: ["Overnight Houseboats", "Vembanad Lake", "Village Life"],
    entryFee: "Free entry, Houseboats ₹6,000 - ₹20,000/night",
    timings: "Boating 6:00 AM – 6:00 PM",
  },
  {
    name: "Hawa Mahal & Amber Fort",
    state: "Rajasthan",
    region: "West",
    category: "Heritage",
    description: "The Palace of Winds in Jaipur, featuring 953 intricately carved jharokhas designed for royal ladies, combined with the majestic hilltop Amber Palace.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    bestTimeToVisit: "October to March",
    highlights: ["Rajput Architecture", "Sheesh Mahal", "Panoramic Jaipur View"],
    entryFee: "₹50 - ₹100 for Indians",
    timings: "9:00 AM – 5:00 PM",
  },
  {
    name: "Varanasi Ghats",
    state: "Uttar Pradesh",
    region: "North",
    category: "Spiritual",
    description: "One of the oldest continuously inhabited cities on Earth. The sacred riverfront steps along Mother Ganga feature mesmerizing evening Ganga Aarti and centuries of devotion.",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    bestTimeToVisit: "November to February",
    highlights: ["Dashashwamedh Ganga Aarti", "Sunrise Boat Ride", "Kashi Vishwanath Temple"],
    entryFee: "Free access, Boat ride ₹300 - ₹1000",
    timings: "Always accessible (Aarti at 6:45 PM)",
  },
  {
    name: "Palolem & Agonda Beaches",
    state: "Goa",
    region: "West",
    category: "Beach",
    description: "Crescent-shaped white sand shores lined with coconut palms and relaxed wooden beach shacks, offering peaceful tropical waters and dolphin spotting.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    bestTimeToVisit: "November to March",
    highlights: ["Dolphin Safari", "Sunset Kayaking", "Fresh Seafood"],
    entryFee: "Free public access",
    timings: "Open 24 hours",
  },
  {
    name: "Kaziranga National Park",
    state: "Assam",
    region: "Northeast",
    category: "Adventure",
    description: "A sanctuary in the Brahmaputra valley home to two-thirds of the world's great one-horned rhinoceroses, wild water buffalo, and royal Bengal tigers.",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    bestTimeToVisit: "November to April",
    highlights: ["One-Horned Rhinos", "Jeep & Elephant Safari", "Brahmaputra Floodplains"],
    entryFee: "₹100 Indians, Safari ₹2,500+",
    timings: "7:00 AM – 4:30 PM",
  },
  {
    name: "Meenakshi Amman Temple",
    state: "Tamil Nadu",
    region: "South",
    category: "Spiritual",
    description: "An architectural marvel in Madurai with 14 colossal gopurams encrusted with thousands of painted mythological figures and the thousand-pillared hall.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    bestTimeToVisit: "October to March",
    highlights: ["Dravidian Architecture", "Thousand Pillar Hall", "Musical Pillars"],
    entryFee: "Free entry, Special darshan ₹50 - ₹100",
    timings: "5:00 AM – 12:30 PM, 4:00 PM – 9:30 PM",
  }
];

export const sampleHotels: HotelItem[] = [
  {
    name: "The Oberoi Udaivilas",
    destination: "Udaipur",
    state: "Rajasthan",
    pricePerNight: 42000,
    budgetTier: "Luxury",
    rating: 4.9,
    reviewsCount: 1420,
    amenities: ["Private Pools", "Lake Pichola View", "Spa & Wellness", "Fine Dining", "Butler Service"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    address: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
    bookingUrl: "https://www.oberoihotels.com",
  },
  {
    name: "Taj Lake Palace",
    destination: "Udaipur",
    state: "Rajasthan",
    pricePerNight: 48000,
    budgetTier: "Luxury",
    rating: 5.0,
    reviewsCount: 2180,
    amenities: ["Floating Palace", "Boat Transfers", "Royal Butler", "Heritage Courtyards", "Jiva Spa"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    address: "Pichola, Udaipur, Rajasthan",
    bookingUrl: "https://www.tajhotels.com",
  },
  {
    name: "Kumarakom Lake Resort",
    destination: "Kumarakom",
    state: "Kerala",
    pricePerNight: 18500,
    budgetTier: "Moderate",
    rating: 4.8,
    reviewsCount: 980,
    amenities: ["Meandering Pool", "Ayurvedic Spa", "Backwater Cruise", "Traditional Seafood", "Free WiFi"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    address: "Kumarakom North Post, Kottayam, Kerala",
    bookingUrl: "https://www.kumarakomlakeresort.in",
  },
  {
    name: "Zostel Rishikesh (Tapovan)",
    destination: "Rishikesh",
    state: "Uttarakhand",
    pricePerNight: 1499,
    budgetTier: "Budget",
    rating: 4.6,
    reviewsCount: 840,
    amenities: ["Rooftop Cafe", "Community Kitchen", "Ganga Views", "Yoga Classes", "High-speed WiFi"],
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
    address: "Badrinath Road, Tapovan, Rishikesh",
    bookingUrl: "https://www.zostel.com",
  },
  {
    name: "Heritage Haveli Resort",
    destination: "Jaipur",
    state: "Rajasthan",
    pricePerNight: 4500,
    budgetTier: "Moderate",
    rating: 4.5,
    reviewsCount: 650,
    amenities: ["Courtyard Dining", "Folk Music Nights", "Swimming Pool", "Cultural Tours", "Free Breakfast"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    address: "Amer Road, Jaipur, Rajasthan",
    bookingUrl: "#",
  },
  {
    name: "Goa Beachfront Huts & Resort",
    destination: "South Goa",
    state: "Goa",
    pricePerNight: 3200,
    budgetTier: "Budget",
    rating: 4.4,
    reviewsCount: 512,
    amenities: ["Beach Access", "Shack Dining", "Sunset Deck", "Bike Rentals", "Air Conditioned"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    address: "Palolem Beach, Canacona, South Goa",
    bookingUrl: "#",
  },
  {
    name: "Snow Peak Retreat Manali",
    destination: "Manali",
    state: "Himachal Pradesh",
    pricePerNight: 4200,
    budgetTier: "Moderate",
    rating: 4.5,
    reviewsCount: 890,
    amenities: ["Mountain View", "Bonfire", "WiFi", "Parking"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    address: "Near Old Manali Bridge, Manali",
    bookingUrl: "#",
  }
];

export const sampleFood: FoodItem[] = [
  {
    name: "Hyderabadi Dum Biryani",
    region: "South",
    state: "Telangana",
    type: "Non-Vegetarian",
    description: "Slow-cooked fragrant Basmati rice layered with marinated tender meat, saffron, fried onions, and whole aromatic spices sealed with dough.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
    famousIn: "Hyderabad (Paradise, Shadab)",
    priceRange: "₹250 - ₹500",
    flavorProfile: "Aromatic, rich, mildly spicy",
  },
  {
    name: "Amritsari Kulcha & Chole",
    region: "North",
    state: "Punjab",
    type: "Vegetarian",
    description: "Crispy, flaky tandoor-baked flatbread stuffed with spiced potatoes and onions, topped with melting white butter and served with tangy chickpea curry.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
    famousIn: "Amritsar (Bhai Kulwant Singh)",
    priceRange: "₹100 - ₹200",
    flavorProfile: "Crispy, buttery, spicy",
  },
  {
    name: "Masala Dosa & Filter Coffee",
    region: "South",
    state: "Karnataka & Tamil Nadu",
    type: "Vegetarian",
    description: "Paper-thin, golden crispy fermented rice and lentil crepe stuffed with spiced potato mash, served with coconut chutney, tomato chutney, and piping hot sambar.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80",
    famousIn: "Bengaluru & Chennai",
    priceRange: "₹80 - ₹180",
    flavorProfile: "Crispy, savory, tangy",
  },
  {
    name: "Litti Chokha",
    region: "East",
    state: "Bihar",
    type: "Vegetarian",
    description: "Traditional whole wheat flour balls stuffed with spiced roasted gram flour (sattu), baked over cow dung cakes or charcoal and drenched in pure desi ghee, served with roasted eggplant chokha.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
    famousIn: "Patna, Gaya",
    priceRange: "₹60 - ₹150",
    flavorProfile: "Earthy, smoky, rustic",
  },
  {
    name: "Bengali Rosogolla & Mishti Doi",
    region: "East",
    state: "West Bengal",
    type: "Dessert",
    description: "Spongy, pillowy cottage cheese (chhena) spheres simmered in light fragrant sugar syrup, paired with caramelized creamy baked earthen-pot sweet yogurt.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80",
    famousIn: "Kolkata (K.C. Das)",
    priceRange: "₹40 - ₹120",
    flavorProfile: "Delicate, sweet, luscious",
  },
  {
    name: "Misal Pav",
    region: "West",
    state: "Maharashtra",
    type: "Street Food",
    description: "A zesty, fiery sprout curry topped with crunchy farsan, freshly chopped onions, cilantro, and lemon, devoured with soft buttered pav buns.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    famousIn: "Kolhapur, Pune, Mumbai",
    priceRange: "₹70 - ₹140",
    flavorProfile: "Fiery, tangy, crunchy",
  }
];

export const sampleCulture: CultureItem[] = [
  {
    title: "Diwali – The Festival of Lights",
    state: "Pan-India",
    region: "All Regions",
    type: "Festival",
    description: "Celebrates the spiritual victory of light over darkness and knowledge over ignorance. Millions of clay diyas, rangoli designs, and fireworks illuminate homes.",
    image: "https://images.unsplash.com/photo-1510525009512-ad7fc3378314?auto=format&fit=crop&w=1200&q=80",
    season: "October / November (Kartika Amavasya)",
    significance: "Lord Rama's homecoming to Ayodhya and worship of Goddess Lakshmi for prosperity.",
  },
  {
    title: "Kathakali Classical Dance Drama",
    state: "Kerala",
    region: "South",
    type: "Dance & Art",
    description: "A 17th-century classical Indian dance-drama distinguished by elaborate colorful makeup, magnificent headgear, dramatic facial expressions, and mudras.",
    image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80",
    season: "Year-Round (Temple festivals in Dec–May)",
    significance: "Depicts epic tales from Mahabharata, Ramayana, and ancient Puranas.",
  },
  {
    title: "Durga Puja & Dhunuchi Dance",
    state: "West Bengal",
    region: "East",
    type: "Festival",
    description: "Inscribed on UNESCO's Intangible Cultural Heritage list. Magnificent artistic pandals house sculpted clay idols with rhythmic dhaak drumming and hypnotic incense dance.",
    image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1200&q=80",
    season: "September / October (Sharad Ritu)",
    significance: "Triumph of Goddess Durga over Mahishasura; celebration of divine feminine energy (Shakti).",
  },
  {
    title: "Pushkar Camel Fair",
    state: "Rajasthan",
    region: "West",
    type: "Tradition",
    description: "One of the world's largest livestock and cultural fairs set against the Thar desert dunes, featuring colorfully adorned camels, folk dances, and sacred holy lake dips.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    season: "November (Kartik Purnima)",
    significance: "Centuries-old trading tradition combined with sacred pilgrimage to the Brahma Temple.",
  },
  {
    title: "Hornbill Festival – Festival of Festivals",
    state: "Nagaland",
    region: "Northeast",
    type: "Festival",
    description: "Brings together all 17 indigenous tribes of Nagaland at Kisama Heritage Village, showcasing traditional warrior chants, folk archery, indigenous dances, and vibrant crafts.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    season: "December 1 to 10 annually",
    significance: "Celebration and preservation of the rich tribal heritage of the Naga people.",
  }
];

// In-memory user fallback store when MongoDB is not connected
export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  savedTrips: any[];
  createdAt: Date;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryUsersCache: MemoryUser[] | undefined;
}

export const inMemoryUsers: MemoryUser[] =
  global.memoryUsersCache || (global.memoryUsersCache = []);

export interface SafetyItem {
  location: string;
  locationSlug: string;
  emergencyContacts: {
    police: string;
    ambulance: string;
    touristHelpline: string;
    fire?: string;
  };
  generalPrecautions: string[];
  healthWarnings: string[];
  localScamsToAvoid: string[];
}

export const sampleSafety: SafetyItem[] = [
  {
    location: "Goa",
    locationSlug: "goa",
    emergencyContacts: {
      police: "100",
      ambulance: "108",
      touristHelpline: "1363",
      fire: "101",
    },
    generalPrecautions: [
      "Swim only in designated areas with lifeguards present.",
      "Avoid isolated beaches after dark.",
      "Keep valuables in hotel safes; beach thefts are common.",
      "Use licensed taxis or pre-booked rides at night.",
    ],
    healthWarnings: [
      "Strong undertows and monsoon currents can be dangerous.",
      "Stay hydrated and use sunscreen — UV levels are high.",
      "Be cautious with street alcohol; stick to reputable venues.",
    ],
    localScamsToAvoid: [
      "Fake water sports operators offering 'government rates'.",
      "Overpriced taxi rides from airports — use prepaid counters.",
      "Drug peddlers near party areas; possession is illegal.",
    ],
  },
  {
    location: "Manali",
    locationSlug: "manali",
    emergencyContacts: {
      police: "100",
      ambulance: "108",
      touristHelpline: "1363",
      fire: "101",
    },
    generalPrecautions: [
      "Acclimatize before high-altitude treks or Rohtang visits.",
      "Carry warm layers even in summer evenings.",
      "Check road status for Rohtang / Atal Tunnel before travel.",
      "Hire only registered adventure operators for paragliding/rafting.",
    ],
    healthWarnings: [
      "Altitude sickness risk above ~2,500m — ascend gradually.",
      "Symptoms: headache, nausea, dizziness — descend if severe.",
      "Drink plenty of water; avoid alcohol on first 48 hours.",
    ],
    localScamsToAvoid: [
      "Unofficial Rohtang permit agents charging inflated fees.",
      "Fake 'local guide' offers near Mall Road without ID.",
      "Overpriced pony rides without agreed rates upfront.",
    ],
  },
  {
    location: "Ladakh",
    locationSlug: "ladakh",
    emergencyContacts: {
      police: "100",
      ambulance: "108",
      touristHelpline: "1363",
      fire: "101",
    },
    generalPrecautions: [
      "Rest 24–48 hours in Leh before going to higher altitudes.",
      "Carry Inner Line Permit where required.",
      "Fill fuel whenever available — stations are sparse.",
      "Inform someone of your route for remote lake trips.",
    ],
    healthWarnings: [
      "Severe altitude sickness risk at Pangong, Khardung La, etc.",
      "Do not ignore AMS symptoms; seek medical help immediately.",
      "Carry basic AMS medication after consulting a doctor.",
    ],
    localScamsToAvoid: [
      "Unlicensed bike rentals without proper paperwork.",
      "Fake Inner Line Permit touts near airports.",
      "Overpriced oxygen cans sold as 'mandatory'.",
    ],
  },
  {
    location: "Rajasthan",
    locationSlug: "rajasthan",
    emergencyContacts: {
      police: "100",
      ambulance: "108",
      touristHelpline: "1363",
      fire: "101",
    },
    generalPrecautions: [
      "Carry water and sun protection in desert regions.",
      "Book heritage stays through verified platforms.",
      "Dress modestly at temples and royal sites.",
      "Negotiate auto/taxi fares or use meters where available.",
    ],
    healthWarnings: [
      "Extreme summer heat (Apr–Jun) — avoid midday outdoor activity.",
      "Stay hydrated; heatstroke risk is real in desert cities.",
    ],
    localScamsToAvoid: [
      "Fake gem/jewelry shops claiming 'government export quality'.",
      "Commission-driven guides pushing shopping stops.",
      "Camel safari operators with unclear return arrangements.",
    ],
  },
  {
    location: "Kerala",
    locationSlug: "kerala",
    emergencyContacts: {
      police: "100",
      ambulance: "108",
      touristHelpline: "1363",
      fire: "101",
    },
    generalPrecautions: [
      "Book houseboats through licensed operators only.",
      "Wear life jackets during backwater activities.",
      "Respect temple dress codes.",
      "Monsoon travel: check landslide/flood advisories.",
    ],
    healthWarnings: [
      "Mosquito-borne illnesses — use repellent in evenings.",
      "Avoid swimming in unguarded coastal areas during monsoon.",
    ],
    localScamsToAvoid: [
      "Unlicensed Ayurveda 'packages' with no qualified practitioners.",
      "Houseboat middlemen inflating rates at boat jetties.",
    ],
  },
  {
    location: "Varanasi",
    locationSlug: "varanasi",
    emergencyContacts: {
      police: "100",
      ambulance: "108",
      touristHelpline: "1363",
      fire: "101",
    },
    generalPrecautions: [
      "Keep belongings secure in crowded ghat areas.",
      "Use trusted boat operators for Ganga aarti views.",
      "Respect rituals and photography restrictions.",
      "Stick to well-lit lanes after dark near the ghats.",
    ],
    healthWarnings: [
      "Do not drink untreated Ganga water.",
      "Street food: prefer busy, freshly cooked stalls.",
    ],
    localScamsToAvoid: [
      "Aggressive 'priest' donation demands at temples.",
      "Fake boatmen claiming exclusive aarti access.",
      "Hashish sellers near Assi Ghat — illegal and risky.",
    ],
  },
  {
    location: "Kashmir",
    locationSlug: "kashmir",
    emergencyContacts: {
      police: "100",
      ambulance: "108",
      touristHelpline: "1363",
      fire: "101",
    },
    generalPrecautions: [
      "Check current travel advisories before remote valley trips.",
      "Hire registered shikara and taxi operators.",
      "Carry warm clothing year-round for evenings.",
      "Keep digital copies of ID and hotel bookings.",
    ],
    healthWarnings: [
      "Cold exposure risk in winter — dress in layers.",
      "Altitude on higher treks — acclimatize properly.",
    ],
    localScamsToAvoid: [
      "Commission-driven houseboat agents at airports.",
      "Fake saffron / dry fruit sellers with inflated claims.",
    ],
  },
  {
    location: "Hyderabad",
    locationSlug: "hyderabad",
    emergencyContacts: {
      police: "100",
      ambulance: "108",
      touristHelpline: "1363",
      fire: "101",
    },
    generalPrecautions: [
      "Use metro/ride-hailing apps in busy traffic corridors.",
      "Stay hydrated in peak summer heat.",
      "Keep an eye on belongings in Charminar crowds.",
    ],
    healthWarnings: [
      "Summer temperatures can exceed 40°C — limit midday walks.",
      "Spicy local cuisine — ease in if you have a sensitive stomach.",
    ],
    localScamsToAvoid: [
      "Overpriced pearls sold as 'authentic Hyderabad pearls' without certification.",
      "Unofficial guides at Golconda / Charminar demanding high fees.",
    ],
  },
];

export interface GuideItem {
  _id?: string;
  name: string;
  location: string;
  locationSlug: string;
  languages: string[];
  govtLicenseId: string;
  licenseFormatValid: boolean;
  isVerified: boolean;
  status: "pending" | "verified" | "rejected";
  profileImage: string;
  bio: string;
  contact: string;
  experienceYears: number;
  createdAt?: Date;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryGuidesCache: GuideItem[] | undefined;
}

export const inMemoryGuides: GuideItem[] =
  global.memoryGuidesCache ||
  (global.memoryGuidesCache = [
    {
      _id: "sample-guide-goa-1",
      name: "Priya Fernandes",
      location: "Goa",
      locationSlug: "goa",
      languages: ["English", "Hindi", "Konkani"],
      govtLicenseId: "MOT-GA-2023-8841",
      licenseFormatValid: true,
      isVerified: true,
      status: "verified",
      profileImage: "",
      bio: "Licensed beach and heritage guide covering Old Goa churches and coastal trails.",
      contact: "priya.guides@example.com",
      experienceYears: 8,
      createdAt: new Date(),
    },
    {
      _id: "sample-guide-manali-1",
      name: "Arjun Thakur",
      location: "Manali",
      locationSlug: "manali",
      languages: ["Hindi", "English", "Pahari"],
      govtLicenseId: "MOT-HP-2022-3310",
      licenseFormatValid: true,
      isVerified: true,
      status: "verified",
      profileImage: "",
      bio: "Mountain trek and Solang Valley specialist with certified adventure first-aid training.",
      contact: "arjun.trails@example.com",
      experienceYears: 12,
      createdAt: new Date(),
    },
  ]);

