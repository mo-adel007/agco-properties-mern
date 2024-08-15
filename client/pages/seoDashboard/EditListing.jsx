import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditListing() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch listing data by ID
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/listing/get/${listingId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch listing.");
        }
        const data = await response.json();
        setName(data.name); // Set name from fetched data
        setDescription(data.description); // Set description from fetched data
        setLoading(false); // Set loading to false after data is loaded
      } catch (error) {
        console.error("Error fetching listing:", error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedListing = {
      name,
      description,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/listing/update/${listingId}`,
        {
          method: "PUT", // Your route uses POST for updates
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`, // Ensure token is included for verification
          },
          body: JSON.stringify(updatedListing),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update listing.");
      }

      alert("Listing updated successfully!");
      navigate("/seo-listings"); // Redirect to a list or another page after successful update
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("There was an error updating the listing. Please try again.");
    }
  };

  const quillRef = useRef();

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
  ];

  if (loading) return <p>Loading...</p>; // Show loading state while data is being fetched

  return (
    <div>
      <h2 className="text-4xl mt-16 text-center font-semibold py-4">
        Edit Listing
      </h2>
      <div className="w-full max-w-3xl p-5 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
        <h2 className="text-3xl font-bold border-b border-gray-400 pb-2 mb-5">
          Listing Editor
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-1 sm:gap-6">
            <div className="sm:col-span-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                Listing Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                  id="name"
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                  placeholder="Type the listing name"
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                Listing Description
              </label>
              <ReactQuill
                ref={quillRef}
                value={description}
                onChange={setDescription}
                modules={modules}
                formats={formats}
                theme="snow"
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-block mt-5 px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
