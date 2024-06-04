import express from "express";
import { createListing, deleteListing, getPublishedListings, publishListing, getListing, unpublishListing, updateListing, getListingsByStatus } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.post('/publish/:id', verifyToken, publishListing);
router.post('/unpublish/:id', verifyToken, unpublishListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/listings',getPublishedListings);
router.get('/get/:id',getListing);
router.get('/listings/:status', getListingsByStatus);

export default router;
