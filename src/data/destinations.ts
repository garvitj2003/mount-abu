export interface Destination {
  id: string;
  slug: string;
  
  // Header Section
  title: string;
  description: string; // The short description at the top

  // Details Section
  details: {
    heading: string; // e.g., "Trail Details" or "About"
    text: string;    // The long description
    images: {
      main: string;        // The large image on the left
      gallery: string[];   // Array of 3 additional images
    };
  };

  // Guidelines Section
  guidelines: {
    entryFee: string;
    timings: string;
    photography: string;
    ageLimit: string;
    quietHours: string;
    smoking: string;
    pets: string;
    // The two cards at the bottom of guidelines
    notes: string[]; 
  };

  // Map Section
  location: {
    lat: number;
    lng: number;
    googleMapsLink?: string;
  };
}

export const destinationsData: Destination[] = [
  {
    id: "1",
    slug: "dilwara-jain-temple",
    title: "Dilwara Jain Temple",
    description: "Renowned for their stunning white marble craftsmanship, these Jain temples from the 11th–13th centuries showcase awe-inspiring carvings, domes, and pillars that reflect India’s architectural brilliance.",
    
    details: {
      heading: "Trail Details",
      text: "The Dilwara Temples were built between the 11th and 13th centuries by Jain ministers Vimal Shah and Tejapala. Vimal Vasahi was constructed in 1031 CE by Vimal Shah, a minister of Bhima I, the Solanki king of Gujarat. Luna Vasahi was built in 1230 CE by Tejapala and his brother Vastupal, ministers of Vastupal, the prime minister of Gujarat. The temples are renowned for their intricate marble carvings, domes, and pillars, showcasing the pinnacle of Jain artistry. The complex includes Pittalhar, Parshvanath, and Mahavir Swami temples, each with unique architectural features and historical significance. The temples have been a center of Jain pilgrimage and cultural heritage for centuries.",
      images: {
        main: "/images/destinations/dilwara-detail.png",
        gallery: [
          "/images/destinations/gallery-1.jpg", // Placeholder
          "/images/destinations/gallery-2.jpg", // Placeholder
          "/images/destinations/gallery-3.jpg"  // Placeholder
        ]
      }
    },

    guidelines: {
      entryFee: "Free",
      timings: "12:00 PM to 5:00 PM",
      photography: "Not allowed inside main halls",
      ageLimit: "Guests of all ages are welcome.",
      quietHours: "Guests must be quiet between 12:00 PM to 5:00 PM",
      smoking: "Smoking not allowed.",
      pets: "Pets are not allowed.",
      notes: [
        "Jain devotees may enter earlier for prayers",
        "Closed on major Jain festivals (check locally)"
      ]
    },

    location: {
      lat: 24.609428,
      lng: 72.722633
    }
  }
];
