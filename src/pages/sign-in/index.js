import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Example validation
        if (!identifier || !password) {
            setError("Both fields are required.");
            return;
        }

        // Add sign-in logic here (e.g., call an API)
        // For now, we'll just log the values
        console.log("Identifier (Email/Username):", identifier);
        console.log("Password:", password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Sign In</h1>

                { error && <p className="text-red-500 mb-4">{ error }</p> }

                <form onSubmit={ handleSubmit }>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="identifier"
                            value={ identifier }
                            placeholder="Username or Phone Number"
                            onChange={ (e) => setIdentifier(e.target.value) }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="password"
                            id="password"
                            value={ password }
                            placeholder="Password"
                            onChange={ (e) => setPassword(e.target.value) }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-green hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-800">
                        Don't have an account? Register here.
                    </Link>
                </div>
            </div>
        </div>
    );
}
