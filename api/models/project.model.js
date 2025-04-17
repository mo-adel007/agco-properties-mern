// src/models/project.model.js
import mongoose from "mongoose";
import slugify from "slugify";
const projectSchema = new mongoose.Schema({
  developer: { type: mongoose.Schema.Types.ObjectId,ref:"Developer", required: true },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required:true
  },
  slug: {type:String, required: false},
  name: { type: String, required: true },
  summary: { type: String, required: false },
  description: { type: String, required: true },
  type: { type: String, required: true },
  imageUrls: { type: Array, required: true },
  address: {type:String,required:true},
  featured: { type: Boolean, default: false, required: false },
  status: { type: String, required: true },
  deliveryDate: { type: Date, required: false },
  typeOfUnit: { type: Array, required: true },
  latitude: { type: Number, required: true }, // New field
  longitude: { type: Number, required: true }, // New field
  altText: { type: String },
  title: { type: String },
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Make sure this exists
   downPaymentPercentage: {type: String, required: false},
      yearsOfInstallments: {type: String, required: false},
startingPrice: {type:Number, required: false},
pageTitle: {type:String},
metaDescription: {type: String},
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
projectSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name") || this.isModified("community") || this.isModified("developer")) {
    try {
      // Populate developer and community names
      await this.populate([
        { path: "community", select: "name developers" },
        { path: "developer", select: "name" }
      ]);

      // Check if the developer is associated with the community
      if (!this.community.developers.includes(this.developer._id)) {
        return next(new Error("Developer is not associated with this community."));
      }

      // Generate slug
      const baseSlug = slugify(
        `${this.developer.name}-${this.community.name}-${this.name}`,
        { lower: true }
      );
      let slug = baseSlug;

      // Ensure unique slug
      const ProjectModel = mongoose.models.Project || mongoose.model("Project", projectSchema);
      let counter = 1;
      while (await ProjectModel.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      this.slug = slug;
    } catch (error) {
      return next(error);
    }
  }
  next();
});
const Project = mongoose.model("Project", projectSchema);

export default Project;
