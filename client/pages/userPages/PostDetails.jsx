import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { Helmet } from 'react-helmet-async';

export default function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Dubai Lifestyle' },
    { id: 2, name: 'Top 10 in Dubai' },
    // Add more categories as needed
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/blog/get/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          console.error('Failed to fetch post');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    // Implement your filtering logic here based on the selected category
  };

  if (!post) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="mt-20 max-w-5xl mx-auto flex flex-col md:flex-row">
    <Helmet>
    <title>{`AGCO Properties | ${post.title}`}</title>
    <meta
      name="description"
      content={`${post.summary}`}
    />
  </Helmet>
      <div className="flex-1">
        <div className="mb-6">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <p className="text-gray-600">Written By | {post.blogAuthor}</p>
          <p className="text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-lg text-gray-700 leading-relaxed">
          {parse(post.content)}
        </div>
      </div>
      <aside className="w-full md:w-1/3 md:pl-8 mt-8 md:mt-52">
        
      
        <div className="mb-6">
          <h3 className="font-bold mb-2">Categories</h3>
          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                className={`cursor-pointer bg-slate-400 hover:bg-red-600 transition-all mb-1 ${
                  selectedCategory === category.id ? 'font-bold text-blue-600' : ''
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
       
      </aside>
    </div>
  );
}
