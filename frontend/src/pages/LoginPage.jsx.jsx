import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCtx from "../context/authContext.jsx";
import api from "../api/api.js";

const LoginPage = () => {
    const { login } = useContext(AuthCtx);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await api("/auth/login", {
                method: "POST",
                body: { username, password }
            });
            login(data.access_token);
            navigate("/notes");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials and try again.");
            return;
        }
    };

    return (
        <div className="flex h-screen">
            
            <div className="w-2/5 bg-gray-900"></div>

            <div className="w-3/5 flex flex-col items-center justify-center bg-white">
                <form
                    onSubmit={handleSubmit}
                    className="w-80 p-6 bg-gray-50 rounded-xl shadow"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mb-4 px-3 py-2 border rounded-md"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 px-3 py-2 border rounded-md"
                    />

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-10">
                    <span className="text-gray-500">Don't have an account? </span>
                    <Link to="/register" className=" w-fit py-2 rounded-md  text-gray-700 hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;;;