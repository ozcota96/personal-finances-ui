import { useEffect, useState } from "react";
import { getUserId } from "../utils/auth";
import api from "../services/api";

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

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-md sm:p-8">
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                        User
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900">Your profile</h1>
                    <p className="mt-2 text-gray-500">Review and manage your personal information.</p>
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

                {isLoading ? (
                    <p className="py-8 text-center text-gray-500">Loading your profile...</p>
                ) : (
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
                )}
            </section>
        </main>
    );
}

export default Profile;