import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { setUser } from "@/redux/slicers/userSlice";
import apiService from "@/services/api-service";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";

export default function SignIn() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const [username, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        username: "",
        password: "",
    });
    const [isValids, setIsValids] = useState({
        username: false,
        password: false,
    });

    const toggleVisibility = () => setIsVisible(!isVisible);

    async function handleSubmit(e) {
        e.preventDefault();
        let dataJSON = {
            username: username,
            password: password,
        };

        try {
            let response = await apiService.signin(dataJSON);

            if (response && response.ok) {
                const { token, result } = response;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(result));
                dispatch(setUser(result));
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

    const handleBlur = (field) => () => {
        if (!eval(field)) {
            setErrors((prev) => ({
                ...prev,
                [field]: `${ field.charAt(0).toUpperCase() + field.slice(1) } is required.`,
            }));
            setIsValids((prev) => ({ ...prev, [field]: true }));
        } else {
            setErrors((prev) => ({ ...prev, [field]: "" }));
            setIsValids((prev) => ({ ...prev, [field]: false }));
        }
    };

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Sign In`} />
            <div className="flex items-center justify-center min-h-screen bg-background-base">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-6">Sign In</h1>

                    {errors.server && <p className="text-red-500 mb-4">{errors.server}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            id="username"
                            value={username}
                            placeholder="Username or Phone Number"
                            onChange={(e) => setIdentifier(e.target.value)}
                            onBlur={handleBlur("username")}
                            required
                            isInvalid={isValids.username}
                            errorMessage={errors.username}
                        />

                        <Input
                            type={isVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={handleBlur("password")}
                            required
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label="toggle password visibility">
                                    {isVisible ? <IoMdEye size={24} /> : <IoMdEyeOff size={24} />}
                                </button>
                            }
                            isInvalid={isValids.password}
                            errorMessage={errors.password}
                        />

                        <button
                            type="submit"
                            className="w-full bg-primary-green hover:bg-green-700 text-white py-2 px-4 rounded">
                            Sign In
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <Link href="/sign-in/recovery" className="text-indigo-600 hover:text-indigo-800">
                            Forgot your password?
                        </Link>
                    </div>
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
