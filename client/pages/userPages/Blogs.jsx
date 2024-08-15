import React, { useEffect, useState } from "react";
import backgroundImage from "../../assets/2.png";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [metadata, setMetadata] = useState({ title: '', description: '' });

  useEffect(() => {
    // Fetch the posts when the component mounts
    fetch("http://localhost:3000/api/blog")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Filter only published posts
        const publishedPosts = data.filter((post) => post.isPublished);
        setPosts(publishedPosts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
      const fetchMetadata = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/blogs`);
          if (!response.ok) {
            throw new Error('Failed to fetch page metadata');
          }
          const data = await response.json();
          setMetadata(data);
        } catch (error) {
          console.error('Error fetching page metadata:', error);
        }
      };
  
      fetchMetadata();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen mt-20">
    <Helmet>
    <title>{`${metadata.title}`}</title>
    <meta
      name="description"
      content={`${metadata.description}`}
    />
  </Helmet>
      {/* Header Image */}
      <div
        className="relative w-full h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
          Blogs
        </h1>
      </div>

      {/* Blog Cards Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.cover})` }} // Post cover image
              >
                <div className="flex justify-end">
                  <span className="bg-black bg-opacity-50 text-white text-sm font-semibold mr-2 mt-2 px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
              <Link to={`/blog/${post._id}`} className="text-red-500 mt-4 font-semibold">
                <h2 className="font-bold text-xl mb-2">{post.title}</h2>
                <p className="text-gray-700 text-base">{post.summary}</p>
                <button className="text-red-500 mt-4 font-semibold">
              
                  READ MORE »
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
