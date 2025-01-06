import { residentialCategories, commercialCategories } from '../constants/categories.js';

export const buildPropertyQuery = (option, category) => {
  const baseQuery = { 
    isPublished: true,
    status: { $ne: "sold" }
  };

  if (!option) return baseQuery;

  if (option === "Commercial") {
    const query = {
      ...baseQuery,
      type: "commercial"
    };

    if (category) {
      if (!commercialCategories.includes(category)) {
        throw new Error("Invalid category for commercial property");
      }
      query.category = category;
    }

    return query;
  }

  // Handle residential properties
  const query = {
    ...baseQuery,
    type: "residential"
  };

  if (option === "Buy") {
    query.status = "buy";
  } else if (option === "Rent") {
    query.status = "rent";
  }

  if (category) {
    if (!residentialCategories.includes(category)) {
      throw new Error("Invalid category for residential property");
    }
    query.category = category;
  }

  return query;
};
