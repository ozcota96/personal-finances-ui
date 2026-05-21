import { useState, useEffect } from "react";
import MovementForm from "../components/MovementForm";
import MovementList from "../components/MovementList";
import { getUserId } from "../utils/auth";
import api from "../services/api";
import AccountForm from "../components/AccountForm";

function Dashboard() {
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showMovementsForm, setShowMovementsForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [accountBalance, setAccountBalance] = useState(null);

  const userId = getUserId();

  useEffect(() => {
    fetchCategories();
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accountId) {
      fetchMovements();
    }
  }, [accountId]);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/users/${userId}/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchMovements = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/accounts/${accountId}/movements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovements(response.data);
    } catch (error) {
      console.error("Error fetching movements:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`users/${userId}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleMovementAdded = () => {
    setShowMovementsForm(false);
    fetchMovements();
  };

  const handleAccountAdded = () => {
    setShowAccountForm(false);
    fetchAccounts();
  }

  const handleAccountChange = (e) => {
    const id = e.target.value;
    setAccountId(id);

    const selectedAccount = accounts.find((acc) => acc.id == id);
    if (selectedAccount) {
      console.log(selectedAccount);
      setAccountBalance(selectedAccount.balance);
    }
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="flex justify-between items-center gap-6 bg-white p-4 mb-6 rounded-xl shadow-md">
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Account</label>
          <select
            value={accountId}
            onChange={handleAccountChange}
            className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-start bg-green-600 text-white px-5 py-3 rounded-xl shadow-md">
          <span>Balance</span>
          <span>
            $
            {accountBalance?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* TODO: Move this option to the user profile */}
        <div>
          <button 
            onClick={() => setShowAccountForm(true)}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg"
          >
            New Account
          </button>
        </div>

        <div>
          {showAccountForm && (
            <AccountForm
              onClose={() => setShowAccountForm(false)}
              onSuccess={handleAccountAdded}
            />
          )}
        </div>

        <div>
          <button
            onClick={() => setShowMovementsForm(true)}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg"
          >
            New Movement
          </button>
        </div>
      </div>

      <div>
        {showMovementsForm && (
          <MovementForm
            onClose={() => setShowMovementsForm(false)}
            onSuccess={handleMovementAdded}
            categories={categories}
            accounts={accounts}
          />
        )}

        <MovementList movements={movements} />
      </div>
    </div>
  );
}

export default Dashboard;
