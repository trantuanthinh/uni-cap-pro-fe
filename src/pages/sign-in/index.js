import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { setUser } from "@/redux/slicers/userSlice";
import apiService from "@/services/api-service";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function SignIn() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [username, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        username: "",
        password: "",
    });
    async function handleSubmit(e) {
        e.preventDefault();
        let dataJSON = {
            username: username,
            password: password,
        };

        try {
            let response = await apiService.signin(dataJSON);

            if (response && response.ok) {
                const { token, data } = response;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(data));
                dispatch(setUser(data));
                router.push("/");
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    server: "Invalid username or password.",
                }));
            }
        } catch (error) {
            console.error("Failed to post user data:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                server: "An error occurred. Please try again.",
            }));
        }
    }

    function handleBlur(field) {
        return () => {
            if (!eval(field)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`,
                }));
            }
        };
    }

    return (
        <>
            <Title label={ `${GlobalSettings.Settings.name} - Sign In` } />
            <div className="flex items-center justify-center min-h-screen bg-background-base">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-6">Sign In</h1>

                    { errors.server && <p className="text-red-500 mb-4">{ errors.server }</p> }

                    <form onSubmit={ handleSubmit }>
                        <div className="mb-4">
                            <input
                                type="text"
                                id="username"
                                value={ username }
                                placeholder="Username or Phone Number"
                                onChange={ (e) => setIdentifier(e.target.value) }
                                onBlur={ handleBlur("username") }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            { errors.username && <p className="text-red-500 text-sm">{ errors.username }</p> }
                        </div>

                        <div className="mb-6">
                            <input
                                type="password"
                                id="password"
                                value={ password }
                                placeholder="Password"
                                onChange={ (e) => setPassword(e.target.value) }
                                onBlur={ handleBlur("password") }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            { errors.password && <p className="text-red-500 text-sm">{ errors.password }</p> }
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
        </>
    );
}
