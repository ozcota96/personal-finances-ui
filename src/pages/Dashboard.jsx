import { useState, useEffect } from "react";
import MovementForm from "../components/MovementForm";
import MovementList from "../components/MovementList";
import { getUserId } from "../utils/auth";
import api from "../services/api";

function Dashboard() {
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [movementToEdit, setMovementToEdit] = useState(null);
  const [showMovementsForm, setShowMovementsForm] = useState(false);
  const [error, setError] = useState("");

  const userId = getUserId();

  useEffect(() => {
    fetchCategories();
    fetchAccounts();
    fetchMovements();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get(`/users/${userId}/accounts`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchMovements = async () => {
    try {
      const response = await api.get("/movements/dashboard");
      setMovements(Array.isArray(response.data) ? response.data : []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load movements.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get(`users/${userId}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleMovementSaved = async () => {
    setShowMovementsForm(false);
    setMovementToEdit(null);
    setError("");
    await fetchMovements();
  };

  const handleNewMovement = () => {
    setMovementToEdit(null);
    setError("");
    setShowMovementsForm(true);
  };

  const handleMovementFormClose = () => {
    setShowMovementsForm(false);
    setMovementToEdit(null);
  };

  const handleMovementEdit = (movement) => {
    setError("");
    setMovementToEdit(movement);
    setShowMovementsForm(true);
  };

  const handleMovementRemove = async (movement) => {
    if (!window.confirm("Delete this movement?")) return;

    setError("");
    try {
      await api.delete(`/movements/${movement.id}`);
      setMovements((currentMovements) =>
        currentMovements.filter(
          (currentMovement) => currentMovement.id !== movement.id,
        ),
      );
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.message ||
          "Unable to delete this movement.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-600">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              All movements
            </h1>
          </div>

          <button
            onClick={handleNewMovement}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            New Movement
          </button>
        </div>

        {error && (
          <div
            className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600"
            role="alert"
          >
            {error}
          </div>
        )}

        {showMovementsForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl">
              <MovementForm
                movement={movementToEdit}
                onClose={handleMovementFormClose}
                onSuccess={handleMovementSaved}
                categories={categories}
                accounts={accounts}
              />
            </div>
          </div>
        )}

        <MovementList
          movements={movements}
          onEdit={handleMovementEdit}
          onRemove={handleMovementRemove}
        />
      </div>
    </div>
  );
}

export default Dashboard;
