// LogoutModal.jsx
import React from "react"

export default function LogoutModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-11/12 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-start mb-4">Confirm Logout</h2>
        <p className="text-slate-400 mb-6 text-start">
          Are you sure you want to log out? You will need to log in again to access your account.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-opacity-60"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
