import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [generalError, setGeneralError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");

        try {
            const response = await api.post("/users/login", { email, password });
            console.log("Login successful:", response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setGeneralError(error.response.data.message);
            } else {
                setGeneralError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="flex h-screen justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl shadow-md w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {generalError && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg text-sm">
                        {generalError}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded-lg"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded-lg"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Login
                </button>

                <p className="text-sm mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;