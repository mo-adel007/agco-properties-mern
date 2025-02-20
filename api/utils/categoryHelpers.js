import { residentialCategories, commercialCategories } from '../constants/categories.js';
import Listing from '../models/listing.model.js';

export const getCategoriesByType = (type) => {
  return type === 'Residential' ? residentialCategories : commercialCategories;
};

export const getCategoryCount = async (type, status, category) => {
  // Base query common to all calls.
  const query = {
    type,
    category,
    isPublished: true,
    // Always exclude sold listings.
    status: { $ne: "sold" },
  };

  // If a specific status is provided and it's not "sold" (which we already exclude),
  // then override the condition to count only that status.
  if (status && status !== "sold") {
    query.status = status;
  }

  return await Listing.countDocuments(query);
};


export const sortCategoriesByCount = (categories) => {
  return categories.sort((a, b) => b.count - a.count);
};
