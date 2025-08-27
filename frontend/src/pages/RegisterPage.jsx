import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api("/auth/register", {
        method: "POST",
        body: { username, password },
      });
      navigate("/");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-2/5 bg-gray-900" />

      <div className="w-3/5 flex flex-col items-center justify-center bg-white">
        <form onSubmit={handleSubmit} className="w-80 p-6 bg-gray-50 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Create account</h2>

          <input
            className="w-full mb-4 px-3 py-2 border rounded-md"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-4 px-3 py-2 border rounded-md"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800">
            Sign Up
          </button>
        </form>

        <div className="mt-10">
          <span className="text-gray-500">Already have an account? </span>
          <Link to="/" className="text-gray-700 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}