import express from 'express';
import { getCategories, getCategoriesWithCount } from '../controllers/categories.controller.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Get categories with listing counts
router.get('/residential/count', (req, res) => {
  req.query.type = 'Residential';
  getCategoriesWithCount(req, res);
});

router.get('/commercial/count', (req, res) => {
  req.query.type = 'Commercial';
  getCategoriesWithCount(req, res);
});


export default router;
