import { useState, useEffect, useCallback } from "react";
import MovementForm from "../components/MovementForm";
import MovementList from "../components/MovementList";
import { getUserId } from "../utils/auth";
import api from "../services/api";

function Dashboard() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [movementToEdit, setMovementToEdit] = useState(null);
  const [showMovementsForm, setShowMovementsForm] = useState(false);
  const [error, setError] = useState("");

  const userId = getUserId();
  const selectedAccount = accounts.find(
    (account) => String(account.id) === String(selectedAccountId),
  );
  const visibleMovements = selectedAccount
    ? movements.filter((movement) => {
        const movementAccountId = movement.accountId ?? movement.account?.id;
        if (movementAccountId != null) {
          return String(movementAccountId) === String(selectedAccount.id);
        }

        const movementAccountName =
          typeof movement.account === "string"
            ? movement.account
            : movement.account?.name ?? movement.accountName;
        return movementAccountName === selectedAccount.name;
      })
    : movements;
  const totalBalance = accounts.reduce(
    (total, account) => total + (Number(account.balance) || 0),
    0,
  );
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    fetchCategories();
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get(`/users/${userId}/accounts`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchMovements = useCallback(async () => {
    try {
      const response = await api.get("/movements/dashboard", {
        params: { year: selectedYear, month: selectedMonth },
      });
      setMovements(Array.isArray(response.data) ? response.data : []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load movements.");
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

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

  const handleAccountSelect = (accountId) => {
    setSelectedAccountId((currentAccountId) =>
      String(currentAccountId) === String(accountId) ? null : accountId,
    );
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
              Welcome back,
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {`${localStorage.getItem("firstName") || ""}`}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label
                htmlFor="dashboard-year"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Year
              </label>
              <select
                id="dashboard-year"
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-36"
              >
                {Array.from({ length: 21 }, (_, index) => currentYear - 10 + index).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="dashboard-month"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Month
              </label>
              <select
                id="dashboard-month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(Number(event.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-40"
              >
                {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                      new Date(currentYear, month - 1, 1),
                    )}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNewMovement}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              New Movement
            </button>
          </div>
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
                initialAccountId={selectedAccount?.id ?? ""}
                onClose={handleMovementFormClose}
                onSuccess={handleMovementSaved}
                categories={categories}
                accounts={accounts}
              />
            </div>
          </div>
        )}

        <section
          aria-label="Account balances"
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-600">
                {selectedAccount ? selectedAccount.name : "Total balance"}
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {currencyFormatter.format(
                  selectedAccount ? Number(selectedAccount.balance) || 0 : totalBalance,
                )}
              </p>
            </div>
            {selectedAccount && (
              <button
                type="button"
                onClick={() => setSelectedAccountId(null)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Show all accounts
              </button>
            )}
          </div>

          {accounts.length > 0 ? (
            <div className="flex snap-x gap-3 overflow-x-auto pb-2">
              {accounts.map((account) => {
                const isSelected =
                  String(account.id) === String(selectedAccountId);

                return (
                  <button
                    key={account.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleAccountSelect(account.id)}
                    className={`min-w-52 snap-start rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block truncate text-sm font-semibold text-slate-800">
                      {account.name}
                    </span>
                    <span className="mt-2 block text-lg font-bold text-slate-900">
                      {currencyFormatter.format(Number(account.balance) || 0)}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No accounts available.</p>
          )}
        </section>

        <MovementList
          movements={visibleMovements}
          onEdit={handleMovementEdit}
          onRemove={handleMovementRemove}
        />
      </div>
    </div>
  );
}

export default Dashboard;
