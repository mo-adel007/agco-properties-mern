import Project from "../models/project.model.js";
import Developer from "../models/developer.model.js";
import Community from "../models/community.model.js";
const staticData = {
  developers: [
    { name: "Emaar", slug: "emaar" },
    { name: "Damac", slug: "damac-hills" },
    { name: "Tilal Al Ghaf", slug: "tilal-al-ghaf" }
  ],
  requirements: [
    { name: "1 bedroom apartments in dubai", slug: "https://agcoproperties.com/properties?option=Rent&bedrooms=1" },
    { name: "studios in dubai", slug: "https://agcoproperties.com/properties?option=Rent&bedrooms=1" },
    { name: "furnished studio apartments", slug: "https://agcoproperties.com/properties?option=Rent&bedrooms=1" },
    { name: "fully furnished apartments", slug: "https://agcoproperties.com/properties?option=Rent&bedrooms=1" },
    { name: "furnished apartments", slug: "https://agcoproperties.com/properties?option=Rent&bedrooms=1" },
],
  communities: [
    { name: "Sobha Hartland 2", slug: "sobha-hartland-2" },
    { name: "Expo City Dubai", slug: "expo-city-dubai" },
    { name: "Akoya Oxygen Dubai", slug: "akoya-oxygen-dubai" },
    { name: "Damac Hills UAE", slug: "damac-hills-uae" },
    { name: "Damac Hills Dubai", slug: "damac-hills-dubai" },
    { name: "Damac Hills 1", slug: "damac-hills-1" },
    { name: "Dubai Hills Estate", slug: "dubai-hills-estate" },
    { name: "MBR City District 1", slug: "mbr-city-district-1" },
    { name: "MBR City District 11", slug: "mbr-city-district-11" },
    { name: "Emaar Beachfront", slug: "emaar-beachfront" },
    { name: "Arabian Ranches", slug: "arabian-ranches" },
    { name: "The Valley", slug: "the-valley" },
    { name: "Emaar South", slug: "emaar-south" },
    { name: "Jumeirah Park", slug: "jumeirah-park" }
  ],
  locations: [
    { name: "Jumeirah Village Circle", slug: "jumeirah-village-circle" },
    { name: "Dubai Land", slug: "dubai-land" },
    { name: "Business Bay", slug: "business-bay" },
    { name: "Marina", slug: "marina" },
    { name: "Dubai Silicon Oasis", slug: "dubai-silicon-oasis" },
    { name: "MBR", slug: "mohammed-bin-rashid-city" },
    { name: "Dubai Creek Harbour", slug: "dubai-creek-harbour" },
    { name: "Majan", slug: "majan" },
    { name: "Dubai South", slug: "dubai-south" },
    { name: "Arjan", slug: "arjan" },
    { name: "Motor City", slug: "motor-city" },
    { name: "Meydan City", slug: "meydan-city" },
    { name: "Al Furjan", slug: "al-furjan" },
    { name: "Jumeirah Village Triangle", slug: "jumeirah-village-triangle" },
    { name: "Jumeirah Golf Estate", slug: "jumeirah-golf-estate" },
    { name: "Town Square", slug: "town-square" },
    { name: "Dubai Investment Park", slug: "dubai-investment-park" },
    { name: "Dubai Islands", slug: "dubai-islands" },
    { name: "JBR", slug: "jumeirah-beach-residence" },
    { name: "Dubai Production City", slug: "dubai-production-city" },
    { name: "Al Barari", slug: "al-barari" },
    { name: "Dubai Canal", slug: "dubai-canal" },
    { name: "City Walk", slug: "city-walk" },
    { name: "Bluewaters Island", slug: "bluewaters-island" }
  ]
};
export const getProjectsData = async (req, res) => {
  try {
    // Fetch projects from the database based on slugs
    let projectsData = {};

     res.status(200).json({
//      projects: projectsData,
      developers: staticData.developers,
      communities: staticData.communities,
      locations: staticData.locations,
	requirements: staticData.requirements
    });
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


