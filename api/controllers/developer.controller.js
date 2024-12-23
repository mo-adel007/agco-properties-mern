import Developer from "../models/developer.model.js";

export const getAllDevelopers = async (req, res) => {
  try {
    // Fetch all developers from the database
    const developers = await Developer.find();

    // Send a successful response with the developers data
    res.status(200).json({
      success: true,
      data: developers,
    });
  } catch (error) {
    console.error("Error fetching developers:", error);
    // Send an error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch developers",
    });
  }
};
export const getDeveloper = async (req, res) => {
  try {
    const { slug } = req.params;
    const developer = await Developer.findOne({ slug: slug });

    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    res.status(200).json(developer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching developer', error: error.message });
  }
};
// Create a new developer
export const createDeveloper = async (req, res) => {
  try {
    const { name, logoUrl, description } = req.body;

    // Create a new Developer document
    const developer = new Developer({ name:name.trim(), logoUrl, description });

    // Save to the database
    await developer.save();

    res.status(201).json({ message: "Developer created successfully", developer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing developer
export const updateDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, description, summary } = req.body;

    // Find the developer by ID and update the document
    const updatedDeveloper = await Developer.findByIdAndUpdate(
      id,
      { name, logoUrl, description, summary },
      { new: true, runValidators: true }
    );

    if (!updatedDeveloper) {
      return res.status(404).json({ message: "Developer not found" });
    }

    res.status(200).json({ message: "Developer updated successfully", updatedDeveloper });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an existing developer
export const deleteDeveloper = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the developer by ID and delete the document
    const deletedDeveloper = await Developer.findByIdAndDelete(id);

    if (!deletedDeveloper) {
      return res.status(404).json({ message: "Developer not found" });
    }

    res.status(200).json({ message: "Developer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

