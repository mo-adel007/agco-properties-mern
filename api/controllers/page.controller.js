// controllers/pageMetaController.js

import PageMeta from "../models/pageMeta.model.js";

// Get all page metadata
export const getPageMetas = async (req, res) => {
  try {
    const pageMetas = await PageMeta.find();
    res.status(200).json(pageMetas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific page metadata
export const getPageMeta = async (req, res) => {
  const { slug } = req.params;
  try {
    const pageMeta = await PageMeta.findOne({ slug: slug });
    if (!pageMeta) return res.status(404).json({ message: "Page not found" });
    res.status(200).json(pageMeta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update page metadata
export const upsertPageMeta = async (req, res) => {
  const { slug } = req.params;
  const { title, description } = req.body;

  try {
    const pageMeta = await PageMeta.findOneAndUpdate(
      { slug: slug },
      { title, description },
      { new: true, upsert: true }
    );
    res.status(200).json(pageMeta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
