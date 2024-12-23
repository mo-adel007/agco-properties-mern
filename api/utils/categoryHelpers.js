import { residentialCategories, commercialCategories } from '../constants/categories.js';
import Listing from '../models/listing.model.js';

export const getCategoriesByType = (type) => {
  return type === 'Residential' ? residentialCategories : commercialCategories;
};

export const getCategoryCount = async (type, status, category) => {
  return await Listing.countDocuments({
    type,
    status,
    category,
    isPublished: true
  });
};
export const sortCategoriesByCount = (categories) => {
  return categories.sort((a, b) => b.count - a.count);
};
