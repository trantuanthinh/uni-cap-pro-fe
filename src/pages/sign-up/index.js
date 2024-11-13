import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { debounce } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "sonner";

export default function SignUp() {
    const router = useRouter();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    const [errors, setErrors] = useState({
        fullname: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        province: "",
        district: "",
        ward: "",
    });

    const [isValids, setIsValids] = useState({
        fullname: false,
        username: false,
        email: false,
        phoneNumber: false,
        password: false,
        confirmPassword: false,
        province: false,
        district: false,
        ward: false,
    });

    const checkPhoneNumber = useCallback(
        debounce((input) => {
            let checkIsNumber = sharedService.isNumber(input);

            setErrors((prevErrors) => ({
                ...prevErrors,
                phone: checkIsNumber ? "" : "Please enter a valid phone number.",
            }));
        }, GlobalSettings.Settings.debounceTimer.valueChanges),
        []
    );

    const loadDistricts = useCallback(
        debounce((provinceId) => {
            apiService
                .getDistricts(provinceId)
                .then((response) => setDistricts(response.result))
                .catch((error) => {
                    toast.error(error.message);
                    console.log(error.message);
                });
        }, GlobalSettings.Settings.debounceTimer.valueChanges),
        []
    );

    const loadWards = useCallback(
        debounce((districtId) => {
            apiService
                .getWards(districtId)
                .then((response) => setWards(response.result))
                .catch((error) => {
                    toast.error(error.message);
                    console.log(error.message);
                });
        })
    );

    useEffect(() => {
        apiService
            .getProvinces()
            .then((response) => setProvinces(response.result))
            .catch((error) => {
                toast.error(error.message);
                console.log(error.message);
            });
    }, []);

    function validateForm() {
        const newErrors = { ...errors };

        for (const key in newErrors) {
            newErrors[key] = "";
        }

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
            address: address,
            provinceId: province.id,
            districtId: district.id,
            wardId: ward.id,
        };
        try {
            let response = await apiService.signup(dataJSON);

            if (response && response.ok) {
                toast.success("Successfully created account. Please sign in to continue.");
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
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Sign Up`} />
            <div className="flex items-center py-6 justify-center w-full min-h-screen bg-background-base">
                <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
                    <h1 className="text-center text-3xl text-text-title font-bold mb-6">Sign Up</h1>

                    {errors.server && <p className="text-red-500 mb-4">{errors.server}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                type="text"
                                id="fullname"
                                value={fullname}
                                onChange={handleChange("fullname", setFullname)}
                                onBlur={handleBlur("fullname")}
                                required
                                isInvalid={isValids.fullname}
                                errorMessage={errors.fullname}
                            />

                            <Input
                                label="Username"
                                type="text"
                                id="username"
                                value={username}
                                onChange={handleChange("username", setUsername)}
                                onBlur={handleBlur("username")}
                                required
                                isInvalid={isValids.username}
                                errorMessage={errors.username}
                            />
                        </div>

                        <Input
                            label="Password"
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={handleChange("password", setPassword)}
                            onBlur={handleBlur("password")}
                            required
                            endContent={
                                <button
                                    className="focus:outline-none opacity-60"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    aria-label="toggle password visibility">
                                    {isPasswordVisible ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
                                </button>
                            }
                            isInvalid={isValids.password}
                            errorMessage={errors.password}
                        />

                        <Input
                            label="Confirm Password"
                            type={isConfirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange("confirmPassword", setConfirmPassword)}
                            onBlur={handleBlur("confirmPassword")}
                            required
                            endContent={
                                <button
                                    className="focus:outline-none opacity-60"
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    aria-label="toggle confirm password visibility">
                                    {isConfirmPasswordVisible ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
                                </button>
                            }
                            isInvalid={isValids.confirmPassword}
                            errorMessage={errors.confirmPassword}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Email"
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleChange("email", setEmail)}
                                onBlur={handleBlur("email")}
                                required
                                isInvalid={isValids.email}
                                errorMessage={errors.email}
                            />

                            <Input
                                label="Phone Number"
                                type="text"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={handleChange("phoneNumber", setPhoneNumber)}
                                onBlur={handleBlur("phoneNumber")}
                                required
                                isInvalid={isValids.phoneNumber}
                                errorMessage={errors.phoneNumber}
                            />
                        </div>

                        <Input
                            label="Address"
                            type={"text"}
                            id="address"
                            value={address}
                            onChange={handleChange("address", setAddress)}
                            onBlur={handleBlur("address")}
                            required
                            isInvalid={isValids.address}
                            errorMessage={errors.address}
                        />

                        <Autocomplete
                            defaultItems={provinces}
                            label="Province"
                            selectedKey={province}
                            onSelectionChange={(selectedId) => {
                                setProvince(selectedId);
                                setDistricts([]);
                                setWards([]);
                                loadDistricts(selectedId);
                            }}
                            onBlur={handleBlur("province")}
                            isInvalid={isValids.province}
                            errorMessage={errors.province}>
                            {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                        </Autocomplete>

                        <Autocomplete
                            defaultItems={districts}
                            label="District"
                            selectedKey={district}
                            onSelectionChange={(selectedId) => {
                                setDistrict(selectedId);
                                setWards([]);
                                loadWards(selectedId);
                            }}
                            onBlur={handleBlur("district")}
                            isInvalid={isValids.district}
                            errorMessage={errors.district}>
                            {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                        </Autocomplete>

                        <Autocomplete
                            defaultItems={wards}
                            label="Ward"
                            selectedKey={ward}
                            onSelectionChange={setWard}
                            onBlur={handleBlur("ward")}
                            isInvalid={isValids.ward}
                            errorMessage={errors.ward}>
                            {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                        </Autocomplete>

                        <button type="submit" className="w-full bg-primary-green hover:bg-green-700 text-white p-4 rounded">
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-800">
                            Already have an account? Sign in here.
                        </Link>
                    </div>
                </div >
            </div >
        </>
    );
}
