import { residentialCategories, commercialCategories } from '../constants/categories.js';
import { getCategoriesByType, getCategoryCount } from '../utils/categoryHelpers.js';

export const getCategories = async (req, res) => {
  try {
    const categories = {
      residential: residentialCategories,
      commercial: commercialCategories
    };

 if (["Residential", "Buy", "Rent"].includes(type)) {
    return residentialCategories;
  } else if (type === "Commercial") {
    return commercialCategories;
  }

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategoriesWithCount = async (req, res) => {
  try {
    const { type, status } = req.query;
    
    const baseCategories = getCategoriesByType(type);

    // Get count for each category
    const categoriesWithCount = await Promise.all(
      baseCategories.map(async (category) => {
        const count = await getCategoryCount(type, status, category);
        return {
          name: category,
          count
        };
      })
    );

    res.status(200).json(categoriesWithCount);
  } catch (error) {
    console.error("Error fetching categories with count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
