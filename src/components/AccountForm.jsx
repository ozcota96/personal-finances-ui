import React, { useState } from "react";
import api from "../services/api";

function AccountForm({ account, onClose, onSuccess }) {
  const [accountName, setAccountName] = useState(account?.name || "");
  const [balance, setbalance] = useState(account?.balance ?? "");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const accountData = {
        name: accountName,
        balance: parseFloat(balance) || 0,
      };

      if (account) {
        await api.put(`/accounts/${account.id}`, accountData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("accounts", accountData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
    } catch (error) {
      if (error.response?.data?.message) setError(error.response.data.message);
      else setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-900/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-50 p-6 text-gray-600 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">
          {account ? "Edit Account" : "New Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="accountName" className="block text-sm font-medium">
            Account Name
          </label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <label htmlFor="balance" className="block text-sm font-medium">
            Balance
          </label>
          <input
            type="text"
            value={balance}
            onChange={(e) => setbalance(e.target.value)}
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
