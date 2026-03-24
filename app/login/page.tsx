"use client"

import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Simple role check for demo
            const role = user.email?.includes("teacher") ? "teacher" : "student";
            window.location.href = `/${role}`;
        } catch (err: any) {
            alert("Login failed: " + err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-800 to-indigo-900 text-white px-4">
            <div className="bg-white text-black rounded-xl shadow-2xl p-10 w-full max-w-sm">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-900">🔐 EduVerse Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-6 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleLogin}
                    className="w-full py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                    Login
                </button>
            </div>
        </div>
    );
}