import { useState, useEffect } from "react";
import MovementForm from "../components/MovementForm";
import MovementList from "../components/MovementList";
import api from "../services/api";

function Dashboard() {
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMovements();
    fetchCategories();
    fetchAccounts();
  }, []);

  const fetchMovements = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/movements", {
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
      const response = await api.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/users/${1}/accounts`, { //hardcoded for testing purposes
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleMovementAdded = () => {
    setShowForm(false);
    fetchMovements();
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg"
        >
          New Movement
        </button>
      </div>
      {showForm && (
        <MovementForm onClose={() => setShowForm(false)} onSuccess={handleMovementAdded} categories={categories} accounts={accounts}/>
      )}

      <MovementList movements={movements} />
    </div>
  );
}

export default Dashboard;