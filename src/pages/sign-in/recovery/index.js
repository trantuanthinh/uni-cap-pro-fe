import apiService from "@/services/api-service";
import { BreadcrumbItem, Breadcrumbs, Button, Input, Link } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "sonner";

export default function RecoveryPassword() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Change Password

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const togglePasswordVisibility = useCallback(() => setIsPasswordVisible((prev) => !prev), []);
    const toggleConfirmPasswordVisibility = useCallback(() => setIsConfirmPasswordVisible((prev) => !prev), []);

    const [errors, setErrors] = useState({});
    const [isValids, setIsValids] = useState({});

    const otpRefs = useRef(Array(6).fill(null));

    const handleChange = useCallback(
        (index, value) => {
            if (value.length > 1) return;

            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                otpRefs.current[index + 1]?.focus();
            }
        },
        [otp]
    );

    const handleKeyDown = useCallback(
        (index, event) => {
            if (event.key === "Backspace" && otp[index] === "" && index > 0) {
                otpRefs.current[index - 1]?.focus();
            }
        },
        [otp]
    );

    const sendOTP = async () => {
        try {
            let dataJSON = { email };
            let response = await apiService.sendOTP(dataJSON);
            if (response && response.ok) {
                setStep(response.result);
                toast.success("OTP sent successfully. Please enter the OTP.");
            }
        } catch (error) {
            console.error("Failed to send OTP:", error);
            setErrors((prev) => ({ ...prev, server: "An error occurred. Please try again." }));
        }
    };

    const verifyOTP = async () => {
        if (otp.some((digit) => digit === "")) {
            toast.error("All OTP digits are required.");
            return;
        }

        try {
            let _otp = otp.join("");
            let dataJSON = { email, otp: _otp };
            console.log("🚀 ~ verifyOTP ~ dataJSON:", dataJSON);
            let response = await apiService.verifyOTP(dataJSON);
            if (response && response.ok) {
                setStep(response.result);
                toast.success("OTP verified. Please set a new password.");
            } else {
                toast.error("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Failed to verify OTP:", error);
            setErrors({ server: "An error occurred. Please try again." });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            let dataJSON = { email, password };
            let response = await apiService.resetPassword(dataJSON);
            if (response && response.ok) {
                toast.success("Password recovered successfully. Please sign in to continue.");
                router.push("/sign-in");
            }
        } catch (error) {
            console.error("Failed to post user data:", error);
            setErrors((prev) => ({ ...prev, server: "An error occurred. Please try again." }));
        }
    };

    const validateForm = () => {
        if (password !== confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
            setIsValids((prev) => ({ ...prev, confirmPassword: true }));
            return false;
        }
        return true;
    };

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
        <div className="container mx-auto py-8">
            <h1 className="text-4xl font-bold mb-8">Recovery Password</h1>

            <div className="grid grid-cols-3 grid-rows-1 gap-5">
                <div className="col-start-2">
                    <Breadcrumbs className="justify-center">
                        {Array.from({ length: step }, (_, index) => (
                            <BreadcrumbItem key={index} isActive={step === index + 1}>
                                Step {index + 1}
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumbs>
                </div>
            </div>

            {step === 1 && (
                <div className="max-w-md mx-auto space-y-4">
                    <h2 className="text-xl font-semibold">Step 1: Receive OTP from Email</h2>
                    <Input
                        type="email"
                        label="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleBlur("email")}
                        required
                        isInvalid={isValids.email}
                        errorMessage={errors.email}
                    />
                    <Button onClick={sendOTP} className="bg-blue-500 text-white mt-4 w-full">
                        Receive OTP
                    </Button>
                    <div className="mt-4 text-center">
                        <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-800">
                            Don't have an account? Register here.
                        </Link>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="max-w-md mx-auto space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Step 2: Verify OTP</h2>
                    <div className="flex flex-row justify-center gap-2">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                id={`otp-${ index }`}
                                type="text" // Change to text for better control
                                value={digit}
                                maxLength={1}
                                placeholder="-"
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onBlur={handleBlur("otp")}
                                required
                                ref={(el) => (otpRefs.current[index] = el)} // Assign ref
                                className="text-center size-10"
                            />
                        ))}
                    </div>
                    <Button onClick={verifyOTP} className="bg-blue-500 text-white mt-4 w-full">
                        Verify OTP
                    </Button>
                </div>
            )}

            {step === 3 && (
                <div className="max-w-md mx-auto space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Step 3: Change Password</h2>
                    <div className="mb-4">
                        <Input
                            label="Password"
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={handleBlur("password")}
                            required
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    aria-label="toggle password visibility">
                                    {isPasswordVisible ? <IoMdEye size={24} /> : <IoMdEyeOff size={24} />}
                                </button>
                            }
                            isInvalid={isValids.password}
                            errorMessage={errors.password}
                        />
                    </div>

                    <div className="mb-6">
                        <Input
                            label="Confirm Password"
                            type={isConfirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={handleBlur("confirmPassword")}
                            required
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    aria-label="toggle confirm password visibility">
                                    {isConfirmPasswordVisible ? <IoMdEye size={24} /> : <IoMdEyeOff size={24} />}
                                </button>
                            }
                            isInvalid={isValids.confirmPassword}
                            errorMessage={errors.confirmPassword}
                        />
                    </div>
                    <Button onClick={handleChangePassword} className="bg-blue-500 text-white mt-4 w-full">
                        Change Password
                    </Button>
                </div>
            )}
            {errors.server && <p className="text-red-500 mt-4">{errors.server}</p>}
        </div>
    );
}
