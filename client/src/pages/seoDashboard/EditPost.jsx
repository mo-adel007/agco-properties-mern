import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firbease"; // Ensure correct import path
import { generateSlug } from "../../utils/generateSlug";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLeft } from "react-icons/ai";
const authors = ["Hajar", "Hossam", "Mohamed"];
const categories = [
  "Dubai Residential Property Investments",
  "Dubai Real Estate Insights",
  "New Build Properties in Dubai",
  "Property Market News",
  "Upcoming Developments for Sale",
  "Current Real Estate Trends",
];

export default function EditPost() {
  const { currentUser } = useSelector((state) => state.user);
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [altText,setAltText] = useState("")
  const [loading, setLoading] = useState(true);


  // Fetch post data by ID
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/blog/get/${postId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post.");
        }
        const data = await response.json();
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.summary);
        setContent(data.content);
        setCoverUrl(data.cover);
        setCategory(data.category);
        setBlogAuthor(data.blogAuthor);
        setAltText(data.altText)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleTitle = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const autoSlug = generateSlug(newTitle);
    setSlug(autoSlug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverUrl) {
      alert("Please upload a cover image");
      return;
    }

    const updatedBlog = {
      title,
      slug,
      cover: coverUrl,
      summary: description,
      content,
      category,
      blogAuthor,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/blog/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify(updatedBlog),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update blog post.");
      }

      toast.success("Blog post updated successfully!");
     setTimeout(()=> navigate("/seo-dashboard"),2000)  // Redirect to a list or another page after successful update
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("There was an error updating the blog post. Please try again.");
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `covers/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
        toast.error("Failed to upload cover image.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setCoverUrl(downloadURL);
          setUploading(false);
          toast.success("Cover image uploaded successfully!");
        });
      }
    );
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const storageRef = ref(storage, `blogImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
          toast.error("Failed to upload image.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();

          quill.insertEmbed(range.index, "image", downloadURL);
        }
      );
    };
  };

  const quillRef = useRef();

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "color", "image"],
          [{ "code-block": true }],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
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
    "indent",
    "image",
    "code-block",
    "color",
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ToastContainer />
      <h2 className="text-4xl mt-16 text-center font-semibold py-4 ">
        Edit Blog Post
      </h2>
      <Link
        to={"/seo-dashboard"}
        className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold"
      >
        <AiOutlineLeft className="w-6 h-6 mr-2" />
        Back to Profile
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 p-8 gap-4">
        <div className="w-full max-w-3xl p-5 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
          <h2 className="text-3xl font-bold border-b border-gray-400 pb-2 mb-5">
            Blog Editor
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="mt-2">
                <select
                  name="author"
                  id="author"
                  value={blogAuthor}
                  onChange={(e) => setBlogAuthor(e.target.value)}
                >
                  <option value="">Select author</option>
                  {authors.map((author) => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <select
                  name="category"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Blog Title
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleTitle}
                    type="text"
                    value={title}
                    name="title"
                    id="title"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    placeholder="Type the blog title"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Blog Slug
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={slug}
                    name="slug"
                    id="slug"
                    readOnly
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    placeholder="Generated automatically"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="altText"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2 "
                >
                  images altText
                </label>
                
                <div className="mt-2">
                  <input
                    onChange={(e) => setAltText(e.target.value)}
                    type="text"
                    name="altText"
                    id="altText"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    placeholder="Type the altText for all images"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Short Description
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={description}
                    name="description"
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    placeholder="Type the short description"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="cover"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Cover Image
                </label>
                <input
                  type="file"
                  onChange={handleCoverUpload}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                />
                {uploading && <p>Uploading cover image...</p>}
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Blog Content
                </label>
                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
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
        <div className="blog-view w-full max-w-3xl p-8 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
          <h2 className="text-3xl font-bold border-b border-gray-400 pb-2 mb-5 ">
            Blog View
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <h2 className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
                Blog Title
              </h2>
              <div className="mt-2">
                <p className="text-2xl font-bold">{title}</p>
              </div>
            </div>
            <div className="sm:col-span-2">
              <h2 className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
                Blog Slug
              </h2>
              <div className="mt-2">
                <p>{slug}</p>
              </div>
            </div>
            <div className="sm:col-span-2">
              <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Blog Description
              </h2>
              <p>{description}</p>
            </div>
            <img src={coverUrl} alt="Cover" className="w-full h-auto mt-4" />

            <div className="sm:col-span-full">
              <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Blog Content
              </h2>
              {parse(content)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
