// components/SeoEditPage.js

import React, { useEffect, useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SeoEditPage() {
  const [pageSlug, setPageSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pages, setPages] = useState([]);

  useEffect(() => {
    // Fetch pages from the backend
    const fetchPages = async () => {
      try {
        const response = await fetch("http://localhost:3000/api");
        if (!response.ok) {
          throw new Error("Failed to fetch pages");
        }
        const data = await response.json();
        setPages(data);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      }
    };

    fetchPages();
  }, []);

  // Handle page selection and fetch metadata
  const handlePageSelect = async (slug) => {
    console.log("Selected slug:", slug); // This should now log the correct slug
    setPageSlug(slug);
    try {
      const response = await fetch(`http://localhost:3000/api/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch page metadata");
      }
      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
    } catch (error) {
      console.error("Error fetching page metadata:", error);
      toast.error("Error fetching page metadata")
    }
  };

  // Save updated metadata
  const handleSave = async () => {
    if (!pageSlug) return;
    try {
      const response = await fetch(`http://localhost:3000/api/${pageSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to save metadata");
      }

      toast.success("Metadata saved successfully");
    } catch (error) {
     toast.error("Error saving metadata");
    }
  };

  return (
    <div className="p-6 mt-20">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">SEO Edit Page</h1>
      <Link
        to={"/seo-dashboard"}
        className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold"
      >
        <AiOutlineLeft className="w-6 h-6 mr-2" />
        Back to Profile
      </Link>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Page:
        </label>
        <select
          value={pageSlug}
          onChange={(e) => handlePageSelect(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a page</option>
          {pages.map((page) => (
            <option key={page._id} value={page.slug}>
              {" "}
              {/* Use `page.slug` here */}
              {page.title} — {page.slug}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          SEO Title:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Meta Description:
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="4"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-4 py-2 rounded shadow"
      >
        Save
      </button>
    </div>
  );
}
