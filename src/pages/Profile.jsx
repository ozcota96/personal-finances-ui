import { useEffect, useState } from "react";
import { getUserId } from "../utils/auth";
import api from "../services/api";
import AccountForm from "../components/AccountForm";

const emptyUser = {
    firstName: "",
    lastName: "",
    email: "",
};

function Profile() {
    const [user, setUser] = useState(emptyUser);
    const [originalUser, setOriginalUser] = useState(emptyUser);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("user");
    const [accounts, setAccounts] = useState([]);
    const [isAccountsLoading, setIsAccountsLoading] = useState(false);
    const [accountError, setAccountError] = useState("");
    const [showAccountForm, setShowAccountForm] = useState(false);
    const [accountToEdit, setAccountToEdit] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${getUserId()}`);
                const userData = {
                    firstName: response.data.firstName || "",
                    lastName: response.data.lastName || "",
                    email: response.data.email || "",
                };
                setUser(userData);
                setOriginalUser(userData);
            } catch (fetchError) {
                setError(fetchError.response?.data?.message || "Unable to load your profile.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (activeTab !== "accounts") return;

        const fetchAccounts = async () => {
            setIsAccountsLoading(true);
            setAccountError("");
            try {
                const response = await api.get(`/users/${getUserId()}/accounts`);
                setAccounts(response.data);
            } catch (fetchError) {
                setAccountError(fetchError.response?.data?.message || "Unable to load your bank accounts.");
            } finally {
                setIsAccountsLoading(false);
            }
        };

        fetchAccounts();
    }, [activeTab]);

    const handleChange = (event) => {
        setUser((currentUser) => ({
            ...currentUser,
            [event.target.name]: event.target.value,
        }));
        setSuccessMessage("");
    };

    const handleCancel = () => {
        setUser(originalUser);
        setIsEditing(false);
        setError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsSaving(true);

        try {
            const response = await api.put(`/users/${getUserId()}`, user);
            const savedUser = {
                firstName: response.data.firstName || user.firstName,
                lastName: response.data.lastName || user.lastName,
                email: response.data.email || user.email,
            };
            setUser(savedUser);
            setOriginalUser(savedUser);
            setIsEditing(false);
            setSuccessMessage("Your profile has been updated.");
        } catch (saveError) {
            setError(saveError.response?.data?.message || "Unable to save your profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAccountSaved = () => {
        setShowAccountForm(false);
        setAccountToEdit(null);
        setActiveTab("accounts");
        setAccountError("");
        api.get(`/users/${getUserId()}/accounts`)
            .then((response) => setAccounts(response.data))
            .catch((fetchError) => {
                setAccountError(fetchError.response?.data?.message || "Unable to load your bank accounts.");
            });
    };

    const handleDeleteAccount = async (accountId) => {
        if (!window.confirm("Delete this bank account?")) return;

        try {
            await api.delete(`/accounts/${accountId}`);
            setAccounts((currentAccounts) => currentAccounts.filter((account) => account.id !== accountId));
        } catch (deleteError) {
            setAccountError(deleteError.response?.data?.message || "Unable to delete this bank account.");
        }
    };

    const openEditAccount = (account) => {
        setAccountToEdit(account);
        setShowAccountForm(true);
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-md sm:p-8">
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                        User
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900">Your profile</h1>
                    <p className="mt-2 text-gray-500">Review and manage your personal information.</p>
                </div>

                <div className="mb-8 flex gap-6 border-b border-gray-200" role="tablist" aria-label="Profile sections">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "user"}
                        onClick={() => setActiveTab("user")}
                        className={`border-b-2 pb-3 text-sm font-semibold transition ${activeTab === "user" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                    >
                        User information
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "accounts"}
                        onClick={() => setActiveTab("accounts")}
                        className={`border-b-2 pb-3 text-sm font-semibold transition ${activeTab === "accounts" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                    >
                        Bank accounts
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">
                        {successMessage}
                    </div>
                )}

                {activeTab === "user" && isLoading ? (
                    <p className="py-8 text-center text-gray-500">Loading your profile...</p>
                ) : activeTab === "user" ? (
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                                First name
                                <input
                                    type="text"
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    required
                                    className="rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 read-only:bg-gray-50 read-only:text-gray-600"
                                />
                            </label>

                            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                                Last name
                                <input
                                    type="text"
                                    name="lastName"
                                    value={user.lastName}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    required
                                    className="rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 read-only:bg-gray-50 read-only:text-gray-600"
                                />
                            </label>

                            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    required
                                    className="rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 read-only:bg-gray-50 read-only:text-gray-600"
                                />
                            </label>
                        </div>

                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                {isEditing ? "Cancel" : "Edit user info"}
                            </button>
                            <button
                                type="submit"
                                disabled={!isEditing || isSaving}
                                className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {isSaving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div role="tabpanel" aria-label="Bank accounts">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Your bank accounts</h2>
                                <p className="mt-1 text-sm text-gray-500">Keep track of your account balances in one place.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setAccountToEdit(null);
                                    setShowAccountForm(true);
                                }}
                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                + New account
                            </button>
                        </div>

                        {accountError && (
                            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
                                {accountError}
                            </div>
                        )}

                        {isAccountsLoading ? (
                            <p className="py-8 text-center text-gray-500">Loading your accounts...</p>
                        ) : accounts.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center text-gray-500">
                                No bank accounts yet.
                            </p>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {accounts.map((account) => {
                                    const balance = Number(account.balance) || 0;
                                    const balanceIsPositive = balance >= 0;

                                    return (
                                        <article key={account.id} className="rounded-xl border border-gray-200 p-5 shadow-sm transition hover:shadow-md">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                                                    <p className={`mt-3 text-2xl font-bold ${balanceIsPositive ? "text-green-600" : "text-red-600"}`}>
                                                        {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        type="button"
                                                        aria-label={`Edit ${account.name}`}
                                                        title="Edit account"
                                                        onClick={() => openEditAccount(account)}
                                                        className="rounded-md p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
                                                            <path d="M12 20h9" strokeLinecap="round" />
                                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        aria-label={`Delete ${account.name}`}
                                                        title="Delete account"
                                                        onClick={() => handleDeleteAccount(account.id)}
                                                        className="rounded-md p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
                                                            <path d="M3 6h18M8 6V4h8v2m-9 0 1 15h8l1-15M10 10v7m4-7v7" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </section>
            {showAccountForm && (
                <AccountForm
                    account={accountToEdit}
                    onClose={() => {
                        setShowAccountForm(false);
                        setAccountToEdit(null);
                    }}
                    onSuccess={handleAccountSaved}
                />
            )}
        </main>
    );
}

export default Profile;