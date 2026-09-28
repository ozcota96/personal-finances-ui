import { useState } from "react";
import api from "../services/api";

function CategoryForm({ type, item, category, onClose, onSuccess }) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [error, setError] = useState("");
  const isSubcategory = type === "subcategory";
  const resourceName = isSubcategory ? "subcategory" : "category";
  const resourcePath = isSubcategory ? "subcategories" : "categories";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const data = {
      name,
      description,
      ...(isSubcategory ? { categoryId: category.id } : {}),
    };
    try {
      if (item) {
        await api.put(`/${resourcePath}/${item.id}`, data);
      } else {
        await api.post(`/${resourcePath}`, data);
      }
      onSuccess();
    } catch (saveError) {
      setError(saveError.response?.data?.message || `Unable to save this ${resourceName}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-900/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        className="w-full max-w-md rounded-lg bg-white p-6 text-gray-700 shadow-xl"
      >
        <h2 id="category-form-title" className="mb-5 text-xl font-semibold text-gray-900">
          {item ? "Edit" : "New"} {resourceName}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSubcategory && (
            <label className="block text-sm font-medium">
              Category
              <input
                type="text"
                value={category?.name || ""}
                readOnly
                className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-600"
              />
            </label>
          )}
          <label className="block text-sm font-medium">
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="block text-sm font-medium">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="mt-1.5 w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CategoryForm;