import { getCategoriesByType, getCategoryCount, sortCategoriesByCount } from '../utils/categoryHelpers.js';

export const getResidentialCategoriesWithCounts = async (req, res, next) => {
  const { status } = req.params;

  if (!status) {
    return res.status(400).json({ error: "Status is required as a parameter." });
  }

  try {
    const categories = getCategoriesByType("Residential");

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        // No need to pass { excludeSold: true } anymore.
        const count = await getCategoryCount("residential", status, category);
        return { name: category, count };
      })
    );

    const sortedCategories = sortCategoriesByCount(categoriesWithCount);

    res.status(200).json(sortedCategories);
  } catch (error) {
    console.error("Error fetching residential categories with counts:", error);
    next(error);
  }
};


export const getCommercialCategoriesWithCounts = async (req, res, next) => {
  try {
    const categories = getCategoriesByType("Commercial");

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        // Count for both "buy" and "rent"
        const countBuy = await getCategoryCount("commercial", "buy", category);
        const countRent = await getCategoryCount("commercial", "rent", category);
        const totalCount = countBuy + countRent;
        return { name: category, count: totalCount };
      })
    );

    const sortedCategories = sortCategoriesByCount(categoriesWithCount);

    res.status(200).json(sortedCategories);
  } catch (error) {
    console.error("Error fetching commercial categories with counts:", error);
    next(error);
  }
};
