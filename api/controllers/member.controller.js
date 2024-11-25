import Member from "../models/member.model.js"; // Adjust the path as needed

// Create a new team member
export const createMember = async (req, res) => {
  const { imageUrls, title, name, isPublished } = req.body;

  if (!imageUrls || !title || !name) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newMember = new Member({
      imageUrls,
      title,
      name,
      isPublished: isPublished || false, // Default to false if not provided
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(500).json({ message: "Failed to create member", error });
  }
};
// Update a team member
export const updateMember = async (req, res) => {
  const { id } = req.params;
  const { imageUrls, title, name, isPublished } = req.body;

  try {
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { imageUrls, title, name, isPublished },
      { new: true } // Returns the updated document
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: "Failed to update member", error });
  }
};
// Delete a team member
export const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete member", error });
  }
};
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team member" });
  }
};
export const getPublishedTeamMembers = async (req, res) => {
  try {
    const publishedMembers = await Member.find({ isPublished: true });
    res.status(200).json(publishedMembers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch published team members", error });
  }
};
