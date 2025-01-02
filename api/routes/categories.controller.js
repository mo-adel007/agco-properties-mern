import express from 'express';
import {
  getResidentialCategoriesWithCounts,
  getCommercialCategoriesWithCounts,
} from '../controllers/categories.controller.js';

const router = express.Router();

// Residential categories route
router.get('/residential-categories/:status', getResidentialCategoriesWithCounts);

// Commercial categories route
router.get('/commercial-categories/:status', getCommercialCategoriesWithCounts);

export default router;
