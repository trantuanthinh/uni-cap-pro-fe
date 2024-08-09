import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import dataManagement from "@/services/data-manage";
import sharedService from "@/services/sharedService";
import { debounce } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function SignUp() {
    const router = useRouter();

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userType, setUserType] = useState("");

    const userTypeList = Object.values(dataManagement.USER_TYPE);

    const [errors, setErrors] = useState({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        userType: "",
    });

    const checkPhoneNumber = useCallback(
        debounce((input) => {
            let checkIsNumber = sharedService.isNumber(input);
            let checkValidPhoneNumber = sharedService.isVietnamesePhoneNumber(input);

            setErrors((prevErrors) => ({
                ...prevErrors,
                phone: checkIsNumber && checkValidPhoneNumber ? "" : "Please enter a valid phone number.",
            }));
        }, GlobalSettings.Settings.debounceTimer.valueChanges),
        []
    );

    function validateForm() {
        const newErrors = { ...errors };

        for (const key in newErrors) {
            newErrors[key] = "";
        }

        if (!fullname) newErrors.fullname = "Full Name is required.";
        if (!username) newErrors.username = "Username is required.";
        if (!email) newErrors.email = "Email is required.";
        if (!phoneNumber) newErrors.phone = "Phone Number is required.";
        if (!password) newErrors.password = "Password is required.";
        if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required.";
        if (!userType) newErrors.userType = "User Type is required.";

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        let dataJSON = {
            username: username,
            name: fullname,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            active_Status: dataManagement.ACTIVE_STATUS.ACTIVE,
            user_Type: dataManagement.USER_TYPE[userType],
            avatar: null,
            description: null,
        };

        try {
            let response = await apiService.postUser(JSON.stringify(dataJSON));

            if (response && response.ok) {
                alert("Successfully created account. Please sign in to continue.");
                router.push("/sign-in");
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

    function handleChange(field, setter) {
        return (e) => {
            if (field === "phone") checkPhoneNumber(e.target.value);
            const value = e.target.value;
            setter(value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: "",
            }));
        };
    }

    return (
        <div className="flex items-center py-6 justify-center min-h-screen bg-background-base">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-center text-3xl text-text-title font-bold mb-6">Sign Up</h1>

                { errors.server && <p className="text-red-500 mb-4">{ errors.server }</p> }

                <form onSubmit={ handleSubmit }>
                    <div className="mb-4">
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            value={ fullname }
                            onChange={ handleChange("fullname", setFullname) }
                            onBlur={ handleBlur("fullname") }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                        { errors.fullname && <p className="text-red-500 text-sm">{ errors.fullname }</p> }
                    </div>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={ username }
                            onChange={ handleChange("username", setUsername) }
                            onBlur={ handleBlur("username") }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                        { errors.username && <p className="text-red-500 text-sm">{ errors.username }</p> }
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={ email }
                            onChange={ handleChange("email", setEmail) }
                            onBlur={ handleBlur("email") }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                        { errors.email && <p className="text-red-500 text-sm">{ errors.email }</p> }
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            value={ phoneNumber }
                            onChange={ handleChange("phone", setPhoneNumber) }
                            onBlur={ handleBlur("phone") }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                        { errors.phone && <p className="text-red-500 text-sm">{ errors.phone }</p> }
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={ password }
                            onChange={ handleChange("password", setPassword) }
                            onBlur={ handleBlur("password") }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                        { errors.password && <p className="text-red-500 text-sm">{ errors.password }</p> }
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={ confirmPassword }
                            onChange={ handleChange("confirmPassword", setConfirmPassword) }
                            onBlur={ handleBlur("confirmPassword") }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                        { errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{ errors.confirmPassword }</p>
                        ) }
                    </div>

                    <div className="mb-4">
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                            User Type
                        </label>
                        <select
                            id="userType"
                            value={ userType }
                            onChange={ (e) => setUserType(e.target.value) }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        >
                            <option value="" disabled>
                                Select a type
                            </option>
                            { userTypeList &&
                                userTypeList.map((userType) => (
                                    <option key={ userType } value={ userType }>
                                        { userType }
                                    </option>
                                )) }
                        </select>
                        { errors.userType && <p className="text-red-500 text-sm">{ errors.userType }</p> }
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-green hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-800">
                        Already have an account? Sign in here.
                    </Link>
                </div>
            </div>
        </div>
    );
}
