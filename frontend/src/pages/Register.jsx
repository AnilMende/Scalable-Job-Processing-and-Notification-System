import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const Register = () => {

    const [form, setForm] = useState({ username: "", email: "", password: "" });

    const naivgate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await api.post("/api/auth/register", form);
            toast.success("Registration Successfull");
            naivgate("/login");

        } catch (error) {
            toast.error("Registration Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 w-full max-w-md">

                <h2 className="text-2xl font-medium text-gray-900 mb-1">Create an Account</h2>
                <p className="text-sm text-gray-500 mb-7">Start processing jobs today</p>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">

                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Name</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm 
                            focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm 
                            focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm 
                            focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    <button type="submit"
                        className="w-full mt-1 bg-gray-900 text-white rounded-lg py-2.5 
                    text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        Create Account
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already Have an Account?{" "}
                        <Link to="/login" className="text-gray-900 font-medium hover:underline" >
                            Sign in
                        </Link>
                    </p>
                </form>


            </div>
        </div>
    )
}

export default Register;