import React, { useState, useEffect } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default function MediaGallery() {
  const { currentUser } = useSelector((state) => state.user);

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metadata, setMetadata] = useState({
    altText: "",
    title: "",
    caption: "",
    description: "",
    modelType: "",
    id: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  const handleUpdateMetadata = async () => {
    try {
      // Determine the endpoint based on modelType
      const endpointMap = {
        community: "community/update",
        project: "project/update",
        listing: "listing/update",
        post: "blog/posts", // Assuming you have a similar endpoint for posts
      };

      const endpoint = endpointMap[metadata.modelType];

      if (!endpoint) {
        alert("Invalid model type.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/${endpoint}/${metadata.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({
            altText: metadata.altText,
            title: metadata.title,
          }),
        }
      );

      if (response.ok) {
        toast.success("Metadata updated successfully!");
        handleCloseModal();
        const allImages = await fetchImages();
        setImages(allImages);
      } else {
        toast.error("Failed to update metadata.");
      }
    } catch (error) {
      toast.error("Error updating metadata");
    }
  };

  const fetchImages = async () => {
    try {
      const listingsResponse = await fetch(
        "http://localhost:3000/api/listing/allListings"
      );
      const listingsData = await listingsResponse.json();

      const projectsResponse = await fetch(
        "http://localhost:3000/api/project"
      );
      const projectsData = await projectsResponse.json();

      const communitiesResponse = await fetch(
        "http://localhost:3000/api/community/communities"
      );
      const communitiesData = await communitiesResponse.json();

      const postsResponse = await fetch(
        "http://localhost:3000/api/blog"
      );
      const postsData = await postsResponse.json();

      const images = [
        ...listingsData.flatMap((listing) =>
          listing.imageUrls.map((url) => ({
            url,
            altText: listing.altText || "", // Ensure altText is always a string
            title: listing.title,
            caption: listing.caption,
            description: listing.description,
            modelType: "listing",
            id: listing._id,
          }))
        ),
        ...projectsData.flatMap((project) =>
          project.imageUrls.map((url) => ({
            url,
            altText: project.altText || "", // Ensure altText is always a string
            title: project.title,
            caption: project.caption,
            description: project.description,
            modelType: "project",
            id: project._id,
          }))
        ),
        ...communitiesData.flatMap((community) =>
          community.imageUrls.map((url) => ({
            url,
            altText: community.altText || "", // Ensure altText is always a string
            title: community.title,
            caption: community.caption,
            description: community.description,
            modelType: "community",
            id: community._id,
          }))
        ),
        ...postsData.map((post) => ({
          url: post.cover,
          altText: post.altText || "", // Ensure altText is always a string
          title: post.title,
          caption: post.summary,
          description: post.summary,
          modelType: "post",
          id: post._id,
        })),
      ];

      return images;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const allImages = await fetchImages();
      setImages(allImages);
    };

    loadImages();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image.url);
    setMetadata({
      altText: image.altText,
      title: image.title,
      caption: image.caption,
      description: image.description,
      modelType: image.modelType,
      id: image.id,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setMetadata({
      altText: "",
      title: "",
      caption: "",
      description: "",
    });
  };

  // Filter images based on the search term
  const filteredImages = images.filter((image) =>
    image.altText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto w-full max-w-8xl mt-20 p-5 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Media Gallery</h1>
      <Link
        to={"/seo-dashboard"}
        className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold"
      >
        <AiOutlineLeft className="w-6 h-6 mr-2" />
        Back to Profile
      </Link>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10"
            placeholder="Search alt text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7l4-4m0 0l4 4m-4-4v18"
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.altText || "default alt"} // Use the correct altText
            className="object-cover w-3/4 ml-12 h-48 cursor-pointer"
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <img src={selectedImage} alt="Selected" className="w-full h-auto" />
          </div>
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-2">Edit Metadata</h2>
            <div>
              <label>Alternative Text</label>
              <input
                type="text"
                value={metadata.altText}
                onChange={(e) =>
                  setMetadata({ ...metadata, altText: e.target.value })
                }
                className="w-full mt-2 border border-gray-300 rounded p-2"
              />

              <label className="mt-4 block">Title</label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) =>
                  setMetadata({ ...metadata, title: e.target.value })
                }
                className="w-full mt-2 border border-gray-300 rounded p-2"
              />

              <button
                onClick={handleUpdateMetadata}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
