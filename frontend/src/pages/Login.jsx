import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            //these sets the cookies in the browser
            await api.post("/api/auth/login", { email, password })
            //redirect after login
            navigate("/dashboard");
        } catch (error) {
            setEmail("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm 
            p-10 w-full max-w-md">

                <h2 className="text-2xl font-medium text-gray-900 mb-1">Welcome back</h2>
                <p className="text-sm text-gray-500 mb-7">Sign in to your account</p>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 
                            text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 
                            text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-1 bg-gray-900 text-white rounded-lg py-2.5 
                        text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;