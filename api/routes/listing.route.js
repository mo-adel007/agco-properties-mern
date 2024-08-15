import express from "express";
import {
  createListing,
  deleteListing,
  getPublishedListings,
  publishListing,
  getListing,
  unpublishListing,
  updateListing,
  getListingsByStatus,
  getListingsByType,
  getFeaturedListings,
  getListingsByCategory,
  getListingsByQuery,
  getListingsByQueryParams,
  getListingsByAdvancedSearch ,
  getListingByProject,
  getStartingPriceByProject,
  getAllListings,
  getSuccessfulListings,
  markAsSold,
  toggleSoldStatus
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.post("/publish/:id", verifyToken, publishListing);
router.post("/unpublish/:id", verifyToken, unpublishListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put("/update/:id", verifyToken, updateListing);
router.get("/listings", getPublishedListings);
router.get("/get/:id", getListing);
router.get("/featured-listings", getFeaturedListings);
router.get("/listings/:status", getListingsByStatus);
router.get("/listings/type/commercial", (req, res, next) => {
  req.params.type = "commercial";
  getListingsByType(req, res, next);
});
router.get("/listings/projects/:name", getListingByProject)
router.get("/listings/category/:category", getListingsByCategory);
router.post("/listings/search", getListingsByQuery);
router.get('/search', getListingsByQueryParams);
router.get('/advanced-search', getListingsByAdvancedSearch);
router.get('/listings/starting-price/:projectId', getStartingPriceByProject);
router.get("/allListings", getAllListings);
router.put("/mark-as-sold/:id",verifyToken, markAsSold);
router.put("/toggle-sold-status/:id", verifyToken, toggleSoldStatus);
router.get("/successful-listings", getSuccessfulListings);



export default router;
