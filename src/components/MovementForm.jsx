import { useEffect, useState } from "react";
import api from "../services/api";

function getMovementAccountId(movement, accounts) {
  const accountName =
    typeof movement?.account === "string"
      ? movement.account
      : movement?.account?.name ?? movement?.accountName;

  return (
    movement?.accountId ??
    movement?.account?.id ??
    accounts.find((account) => account.name === accountName)?.id ??
    ""
  );
}

function getMovementCategoryId(movement, categories) {
  const category = movement?.category;
  const categoryName =
    typeof category === "string" ? category : category?.name ?? movement?.categoryName;

  return (
    movement?.categoryId ??
    category?.id ??
    categories.find((item) => item.name === categoryName)?.id ??
    ""
  );
}

function getMovementSubcategoryId(movement, categories) {
  const subcategory = movement?.subcategory;
  const subcategoryName =
    typeof subcategory === "string"
      ? subcategory
      : subcategory?.name ?? movement?.subcategoryName;
  const categoryId = getMovementCategoryId(movement, categories);
  const category = categories.find(
    (item) => String(item.id) === String(categoryId),
  );

  return (
    movement?.subcategoryId ??
    subcategory?.id ??
    category?.subcategories?.find(
      (item) => item.name === subcategoryName,
    )?.id ??
    ""
  );
}

function MovementForm({
  movement,
  initialAccountId = "",
  onClose,
  onSuccess,
  categories = [],
  accounts = [],
}) {
  const [amount, setAmount] = useState(movement?.amount ?? "");
  const [description, setDescription] = useState(movement?.description ?? "");
  const [accountId, setAccountId] = useState(
    movement?.accountId ?? movement?.account?.id ?? initialAccountId,
  );
  const [type, setType] = useState(Number(movement?.type ?? 1));
  const [date, setDate] = useState(movement?.date?.slice(0, 10) ?? "");
  const [categoryId, setCategoryId] = useState(
    getMovementCategoryId(movement, categories),
  );
  const [subcategoryId, setSubcategoryId] = useState(
    getMovementSubcategoryId(movement, categories),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!movement) return;

    setAccountId((currentId) => currentId || getMovementAccountId(movement, accounts));
    setCategoryId((currentId) => currentId || getMovementCategoryId(movement, categories));
    setSubcategoryId((currentId) => currentId || getMovementSubcategoryId(movement, categories));
  }, [movement, accounts, categories]);

  const selectedCategory = categories.find(
    (category) => String(category.id) === String(categoryId),
  );
  const subcategoryOptions = selectedCategory?.subcategories ?? [];

  const handleCategoryChange = (event) => {
    const nextCategoryId = event.target.value;
    setCategoryId(nextCategoryId ? Number(nextCategoryId) : "");
    setSubcategoryId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const movementData = {
        amount: parseFloat(amount),
        description,
        accountId: Number(accountId),
        type: Number(type),
        categoryId: Number(categoryId),
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
        date,
      };

      if (movement) {
        await api.put(`/movements/${movement.id}`, movementData);
      } else {
        await api.post("/movements", movementData);
      }
      onSuccess();
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to save this movement.");
      }
    }
  };

  return (
    <div
      className="rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200 sm:p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-600">
            Movement
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {movement ? "Edit Movement" : "New Movement"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close movement form"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <input
              type="text"
              placeholder="Groceries, rent, salary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="mb-1 block text-sm font-medium text-slate-700">Type</legend>
            <div className="flex gap-4 rounded-lg border border-slate-300 px-3 py-2.5">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="movementType"
                  value={0}
                  checked={type === 0}
                  onChange={() => setType(0)}
                  className="size-4 accent-emerald-600"
                />
                Income
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="movementType"
                  value={1}
                  checked={type === 1}
                  onChange={() => setType(1)}
                  className="size-4 accent-rose-600"
                />
                Expense
              </label>
            </div>
          </fieldset>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select
              value={categoryId}
              onChange={handleCategoryChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Subcategory</label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-100"
              disabled={!selectedCategory || !subcategoryOptions.length}
            >
              <option value="">{subcategoryOptions.length ? "Select a subcategory" : "No subcategories available"}</option>
              {subcategoryOptions.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            {movement ? "Save changes" : "Save movement"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MovementForm;
