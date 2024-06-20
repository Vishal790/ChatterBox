import React from "react";

const DeleteModal = ({ setDeleteModal, confirmDeleteHandler }) => {



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-center">Delete Item</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete this Group?
        </p>
        <div className="flex justify-between">
          <button
            onClick={confirmDeleteHandler}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-200"
          >
            Delete
          </button>
          <button
            onClick={() => setDeleteModal(false)}
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
