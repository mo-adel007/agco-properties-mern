import emar from "../assets/edits/emar.png";
import damac from "../assets/edits/damac.png";
import shobah from "../assets/edits/shobah.png";
import nakheel from "../assets/edits/NakheellogoNavy.png";
import nshama from "../assets/edits/nashama.png";
import meraas from "../assets/edits/Meraas.png";
import dubaiProperties from "../assets/edits/dubai-properties.png";
import tag from "../assets/edits/TAG_.png";
import ellington from "../assets/edits/ellington.png";
import samana from "../assets/edits/samana.png";
import aldar from "../assets/edits/el-daar.png";
import masaar from "../assets/edits/massar.png";
import communityImage from "../assets/city.jpg"

export const developersData = {
    emaar: {
      name: "EMAAR",
      logo: emar,
      description: "With a net asset value of 138.1B AED (37.6B USD)*, Emaar Properties is among the most admired and valuable real estate development companies in the world. Emaar, which has established competencies in real estate, retail and shopping malls, hospitality, and leisure, shapes new lifestyles through its commitment to design excellence, build quality, and timely delivery.",
      communities: ["Downtown Dubai", "The Oasis","Emaar South","Emaar Beach Front","Arabian Ranches","Dubai Creek Harbour","Dubai Marina","The Valley","Rachid Yachts & Marina","Address Al Marjan Island,Ras Al Khaimah"],
      projects: [
        { name: "Silvertown", imageUrl: communityImage, link: "/community/silvertown" },
        { name: "Zed East", imageUrl: communityImage, link: "/community/zed-east" },
        { name: "Solana", imageUrl: communityImage, link: "/community/solana" }
      ]
    },
    damac: {
      name: "DAMAC",
      logo: damac,
      description: "DAMAC Properties has been shaping the Middle East's luxury real estate market since 2002, delivering iconic projects across the region. Known for its high-end properties and commitment to excellence, DAMAC is a leader in branded residences and luxury living.",
      communities: ["DAMAC Hills", "DAMAC Hills 2","DAMAC Lagoons"],
      projects: [
        { name: "DAMAC Hills", imageUrl: communityImage, link: "/community/damac-hills" },
        { name: "DAMAC Hills 2", imageUrl: communityImage, link: "/community/akoya" },
        { name: "DAMAC Lagoons", imageUrl: communityImage, link: "/community/business-bay" }
      ]
    },
    // Add more developers similarly...
  };