import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLeft } from "react-icons/ai";
export default function EditProject() {
  const { projectId } = useParams(); // Use useParams to get the project ID from the URL
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState(""); // New state for summary
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch project data by ID
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/project/get/${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project.");
        }
        const data = await response.json();
        setName(data.name);
        setSummary(data.summary); // Set summary
        setDescription(data.description);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProject = {
      name,
      summary, // Include summary in the update
      description,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/project/update/${projectId}`, {
        method: "PUT", // Use PUT method for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`, // Ensure token is included for verification
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error("Failed to update project.");
      }

      toast.success("Project updated successfully!");
      setTimeout(() => navigate("/seo-projects"), 2000) // Redirect to a list or another page after successful update
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("There was an error updating the project. Please try again.");
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

  if (loading) return <p className="text-center my-7 mt-20 text-2xl">Loading...</p>;
  if (error) return <p className="text-center my-7 mt-20 text-2xl">Something went wrong!</p>;

  return (
    <div>
      <ToastContainer />
      <h2 className="text-4xl mt-16 text-center font-semibold py-4">Edit Project</h2>
      <Link
        to={"/seo-projects"}
        className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold"
      >
        <AiOutlineLeft className="w-6 h-6 mr-2" />
        Back to projects
      </Link>
      <div className="w-full max-w-3xl p-5 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
        <h2 className="text-3xl font-bold border-b border-gray-400 pb-2 mb-5">Project Editor</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-1 sm:gap-6">
            <div className="sm:col-span-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                Project Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                  id="name"
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                  placeholder="Type the project name"
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label
                htmlFor="summary"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                Project Summary
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  name="summary"
                  id="summary"
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                  placeholder="Type the project summary"
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                Description
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
