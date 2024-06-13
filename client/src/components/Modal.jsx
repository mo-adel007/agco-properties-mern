import React from "react";

const Modal = ({ title, closeModal, formFields }) => {
  return (
    <div className="fade-in-bottom fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={closeModal}
            className="text-gray-700 hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formFields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {field}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
