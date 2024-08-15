import React, { useState } from "react";

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    cv: null,
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cv: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="flex justify-center mt-24">
      {/* Dubai Office */}
      <div className="w-full max-w-lg mx-4 p-8 bg-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Dubai Office</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
              placeholder="Name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
              placeholder="Phone"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Position <span className="text-red-600">*</span>
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="">Select Position</option>
              <option value="Property Consultant">Property Consultant</option>
              <option value="Office Manager">Office Manager</option>
              {/* Add other positions here */}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Your Updated CV | PDF Only <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              name="cv"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Any Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Any Notes ......"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold p-3 rounded"
          >
            SEND
          </button>
        </form>
      </div>

      {/* Cairo Office */}
      <div className="w-full max-w-lg mx-4 p-8 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Cairo Office</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
              placeholder="Name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
              placeholder="Phone"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Position <span className="text-red-600">*</span>
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="">Select Position</option>
              <option value="Property Consultant">Property Consultant</option>
              <option value="Office Manager">Office Manager</option>
              {/* Add other positions here */}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Your Updated CV | PDF Only <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              name="cv"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Any Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              placeholder="Any Notes ......"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold p-3 rounded"
            
          >
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
