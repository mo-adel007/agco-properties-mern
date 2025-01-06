import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  developer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Developer"
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Agent",
  },
slug: {type:String},
permitNumber: {type:Number },
permitLink: {type: String},
unitNumber: {type: String, required:true},
  imageUrls: [{ type: String, required: true }],
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, enum: ["commercial", "residential"], required: true },
  status: { type: String, enum: ["buy", "rent", "sold"], required: true },
  category: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  size: { type: Number, required: true },
  regularPrice: { type: Number, required: true },
  isPublished: { type: Boolean, required: true },
  featured: { type: Boolean, required: true },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  altText: { type: String },
title: {type:String},
latitude: {type:Number, required:true },
longitude: {type:Number, required:true},
amenities: {
  parking: { type: Boolean, default: false},
  furnished: { type: Boolean, default: false }, 
  airConditioning: { type: Boolean, default: false },
  balcony: { type: Boolean, default: false },
  barbecueArea: { type: Boolean, default: false },
  barbeque: { type: Boolean, default: false },
  basement: { type: Boolean, default: false },
  builtInWardrobes: { type: Boolean, default: false },
  centralAC: { type: Boolean, default: false },
  childrensPlayArea: { type: Boolean, default: false },
  childrensPool: { type: Boolean, default: false },
  communityView: { type: Boolean, default: false },
  concierge: { type: Boolean, default: false },
  conferenceRoom: { type: Boolean, default: false },
  coveredParking: { type: Boolean, default: false },
  diningInBuilding: { type: Boolean, default: false },
  dryer: { type: Boolean, default: false},
  gardenView: { type: Boolean, default: false },
  gym: { type: Boolean, default: false },
  heating: { type: Boolean, default: false },
  kitchenAppliances: { type: Boolean, default: false },
  laundry: { type: Boolean, default: false},
  lawn: { type: Boolean, default: false},
  lobbyInBuilding: { type: Boolean, default: false},
  maidService: { type: Boolean, default: false },
  maidsRoom: { type: Boolean, default: false },
  maintenance: { type: Boolean, default: false },
  microwave: { type: Boolean, default: false },
  nearMetro: { type: Boolean, default: false },
  nearMosque: { type: Boolean, default: false },
  nearPublicTransport: { type: Boolean, default: false },
  nearRestaurants: { type: Boolean, default: false },
  nearSupermarket: { type: Boolean, default: false },
  networked: { type: Boolean, default: false },
  outdoorShower: { type: Boolean, default: false },
  partlyFurnished: { type: Boolean, default: false },
  petsAllowed: { type: Boolean, default: false },
  privateGarden: { type: Boolean, default: false },
  privateJacuzzi: { type: Boolean, default: false },
  refrigerator: { type: Boolean, default: false },
  sauna: { type: Boolean, default: false },
  security: { type: Boolean, default: false },
  sharedGym: { type: Boolean, default: false },
  sharedPool: { type: Boolean, default: false },
  sharedSpa: { type: Boolean, default: false },
  study: { type: Boolean , default: false},
  swimmingPool: { type: Boolean, default: false },
  tvCable: { type: Boolean, default: false },
  unfurnished: { type: Boolean, default: false},
  vastuCompliant: { type: Boolean, default: false },
  viewOfLandmark: { type: Boolean, default: false},
  viewOfWater: { type: Boolean, default: false},
  walkInCloset: { type: Boolean, default: false },
  washer: { type: Boolean, default: false },
  wifi: { type: Boolean, default: false },
  windowCoverings: { type: Boolean, default: false },
},
}, { timestamps: true });
listingSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    // Generate slug from name and optionally unitNo if it helps differentiate
    this.slug = this.unitNo
      ? `${this.name.toLowerCase().replace(/\s+/g, "-")}-${this.unitNo}`
      : this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});
const Listing = mongoose.model("Listing", listingSchema);
export default Listing;

