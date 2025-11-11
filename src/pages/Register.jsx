import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    try {
      await api.post("/users", form);
      alert("User registered successfully!");
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.message) {
          setGeneralError(data.message);
        }
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError("An unexpected error occurred.");
        }
      }
    }
  };

  return (
    <div className="bg-gray-50 text-gray-600 flex rounded justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {generalError && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg text-sm">
            {generalError}
          </div>
        )}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
        />
        {errors.FirstName && (
          <p className="text-red-500 text-sm mb-2">{errors.FirstName[0]}</p>
        )}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
        />
        {errors.LastName && (
          <p className="text-red-500 text-sm mb-2">{errors.LastName[0]}</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
        />
        {errors.Email && (
          <p className="text-red-500 text-sm mb-2">{errors.Email[0]}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
        />
        {errors.Password && (
          <p className="text-red-500 text-sm mb-2">{errors.Password[0]}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account? {" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
