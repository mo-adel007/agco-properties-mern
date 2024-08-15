import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

const UserProfile = ({ userId }) => {
  const [content, setContent] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/content/${userId}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        const data = await response.json();
        console.log('Fetched content:', data); // Log the fetched content

        setContent(data);
      } catch (error) {
        console.error('Failed to fetch user content:', error);
      }
    };

    fetchUserContent();
  }, [userId]);

  return (
    <div className="max-w-2xl mx-auto p-4 mt-8 bg-white shadow rounded-lg">
    <h2 className="text-xl font-bold mb-4">User Content</h2>
    <ul>
      {content && content.length > 0 ? (
        content.map((item) => (
          <li key={item._id} className="mb-2 border-b pb-2">
            <div className="text-gray-700">{item.name}</div>
            <div className="text-gray-500">{item.description}</div>
          </li>
        ))
      ) : (
        <p>No content available for this user.</p> // Display a message if no content is found
      )}
    </ul>
  </div>
  );
};

export default UserProfile;
