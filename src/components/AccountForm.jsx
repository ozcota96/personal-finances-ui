import React, { useState } from "react";
import api from "../services/api";

function AccountForm({ onClose, onSuccess }) {
  const [accountName, setAccountName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "accounts",
        {
            name: accountName,
            initialBalance: parseFloat(initialBalance) || 0,
        },
        { 
            headers: { Authorization: `Bearer ${token}` }
        }
      );
      onSuccess();
    } catch (error) {
      if (error.response?.data?.message) setError(error.response.data.message);
      else setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed justify-center-items-center">
      <div className="bg-gray-50 text-gray-600 rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">New Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Initial Balance"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 transition px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountForm;
