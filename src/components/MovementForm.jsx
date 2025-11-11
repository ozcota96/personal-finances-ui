import { useState } from "react";
import api from "../services/api";

function MovementForm({ onClose, onSuccess, categories, accounts }) {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [accountId, setAccountId] = useState("");
    const [type, setType] = useState(1); // 0 for income, 1 for expense
    const [date, setDate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState();
    const [error, setError] = useState("");

    const selectedCategory = categories.find((c) => c.id === categoryId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/movements",
                { amount: parseFloat(amount), description, accountId, type, categoryId, subcategoryId, date },
                {headers: { Authorization: `Bearer ${token}` } }
            );
            onSuccess();
        } catch (error) {
            if(error.response?.data?.message) setError(error.response.data.message);
            else setError("An unexpected error occurred.");
        }
    };

    return (
        <div className="fixed justify-center-items-center">
            <div className="bg-gray-50 text-gray-600 rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">New Movement</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2" required/>
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg px-3 py-2" required/>
                    <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                        <option value="">Select an account</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                    </select>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                        <option value="0">Income</option>
                        <option value="1">Expense</option>
                    </select>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" required/>
                    <select value={categoryId} onChange={(e) => {
                        setCategoryId(e.target.value);
                        setSubcategoryId();
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                    required>
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="w-full border rounded-lg px-3 py-2" disabled={!selectedCategory || !selectedCategory.subcategories?.length}>
                        <option value="">Select a subcategory</option>
                        {selectedCategory?.subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                        ))}
                    </select>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 transition px-4 py-2 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MovementForm;