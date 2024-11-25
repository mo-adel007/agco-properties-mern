import Agent from "../models/agents.model.js";
import Listing from "../models/listing.model.js";

// Create a new agent
export const createAgent = async (req, res) => {
  try {
    const agent = new Agent({
      imageUrls: req.body.imageUrls,
      title: req.body.title,
      name: req.body.name,
      isPublished: req.body.isPublished,
	slug:req.body.name,
email: req.body.email,
 languages: req.body.languages,
nationality: req.body.nationality,
phoneNumber: req.body.phoneNumber
    });

    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing agent
// Update an agent by ID
export const updateAgentById = async (req, res) => {
    try {
      const updatedAgent = await Agent.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
  
      if (!updatedAgent) {
        return res.status(404).json({ message: "Agent not found" });
      }
  
      res.status(200).json(updatedAgent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Publish an agent
export const publishAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.isPublished = true;
    await agent.save();
    res.status(200).json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Unpublish an agent
export const unpublishAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.isPublished = false;
    await agent.save();
    res.status(200).json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublishedAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ isPublished: true });
 for (let agent of agents) {
      const listingsCount = await Listing.countDocuments({ agent: agent._id });
      agent.numberOfListings = listingsCount;
    }
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAgentById = async (req, res) => {
    try {
      const agent = await Agent.findById(req.params.id);
  
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
  
      res.status(200).json(agent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getAgentBySlug = async (req, res) => {
  try {
    // Fetch agent by slug instead of ID
    const agent = await Agent.findOne({ slug: req.params.slug });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
 const listingsCount = await Listing.countDocuments({ agent: agent._id });

    // Add the listings count to the agent object
    agent.numberOfListings = listingsCount;
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agent", error: error.message });
  }
};
