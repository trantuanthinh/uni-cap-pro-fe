"use client";

import LinkButton from "@/components/shared/buttons/link-button";
import ConfirmDialog from "@/components/shared/default-confirm-dialog";
import LoadingIndicator from "@/components/shared/loading-indicator";
import StarRating from "@/components/shared/star-rating";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { setUser } from "@/redux/slicers/userSlice";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import {
    Accordion,
    AccordionItem,
    Autocomplete,
    AutocompleteItem,
    Button,
    Card,
    CardBody,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Listbox,
    ListboxItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import { debounce } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { IoMdEye, IoMdEyeOff, IoMdTrash } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function ProfileLayout() {
    const user = useSelector((state) => state.user);
    const router = useRouter();
    const { slug } = router.query;

    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [currentTab, setCurrentTab] = useState("info");

    const tabs = [
        {
            key: "info",
            content: <OverviewTab user={user} />,
        },
        {
            key: "orders",
            content: <OrdersTab router={router} user={user} isLoading={isLoading} />,
        },
        {
            key: "changePassword",
            content: <ChangePasswordTab user={user} isLoading={isLoading} />,
        },
        {
            key: "products",
            content: <ManageProductsTab user={user} isLoading={isLoading} />,
        },
    ];

    useEffect(() => {
        if (router.isReady && user) {
            //temporary
            if (slug === user.username) {
                router.push({
                    query: { slug: user.username },
                });
            }
            setIsLoading(false);
        }
    }, [router.isReady, slug, user]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - ${ user?.username }`} />
            {isMounted && user ? (
                <div className="min-h-full flex flex-row mx-auto px-6 border-t-2">
                    <div className="basis-1/6">
                        <Accordion className="min-h-full " defaultExpandedKeys={["YourProfile"]} selectionMode="multiple">
                            <AccordionItem key="YourProfile" aria-label="Your Profile" title="Your Profile">
                                <Listbox aria-label="Actions" onAction={(key) => setCurrentTab(key)}>
                                    <ListboxItem key="info">Basic Information</ListboxItem>
                                    <ListboxItem key="settings">Account Settings</ListboxItem>
                                    <ListboxItem key="changePassword">Change Password</ListboxItem>
                                </Listbox>
                            </AccordionItem>

                            <AccordionItem key="YourOrders" aria-label="Your Orders" title="Your Orders">
                                <Listbox aria-label="Actions" onAction={(key) => setCurrentTab(key)}>
                                    <ListboxItem key="orders">All Orders</ListboxItem>
                                    <ListboxItem key="pending">Pending Orders</ListboxItem>
                                    <ListboxItem key="delivering">Delivering Orders</ListboxItem>
                                    <ListboxItem key="delivered">Delivered Orders</ListboxItem>
                                </Listbox>
                            </AccordionItem>

                            {user && user.type === "SELLER" && (
                                <AccordionItem key="YourProducts" aria-label="All Products" title="All Products">
                                    <Listbox aria-label="Actions" onAction={(key) => setCurrentTab(key)}>
                                        <ListboxItem key="products">All Products</ListboxItem>
                                        <ListboxItem key="best">Best-Seller</ListboxItem>
                                    </Listbox>
                                </AccordionItem>
                            )}

                            <AccordionItem key="YourFeedbacks" aria-label="Your Feedbacks" title="Your Feedbacks">
                                <Listbox aria-label="Actions" onAction={(key) => setCurrentTab(key)}>
                                    <ListboxItem key="feedbacks">All Feedbacks</ListboxItem>
                                    <ListboxItem key="provide">Provide Feedbacks</ListboxItem>
                                </Listbox>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div className="basis-5/6 overflow-auto min-h-full p-4">
                        {tabs.map(
                            (tab, index) =>
                                tab.key === currentTab && (
                                    <Card key={index} className="bg-white shadow-lg min-h-full rounded-lg mb-4">
                                        <CardBody>{tab.content}</CardBody>
                                    </Card>
                                )
                        )}
                    </div>
                </div>
            ) : (
                <LoadingIndicator />
            )}
        </>
    );
}

const Avatar = ({ user }) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(user?.avatar);
    const dispatch = useDispatch();
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const onUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file && file.size <= MAX_FILE_SIZE) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                toast.error("File size exceeds the limit of 5 MB.");
            }
        };
        input.click();
    };

    const confirmUpload = () => {
        if (!selectedFile) return;
        apiService
            .uploadAvatar(selectedFile, user.id)
            .then(() => {
                toast.success("Avatar uploaded successfully");
                return apiService.getUser(user.id);
            })
            .then((updatedUser) => {
                setPreview(null);
                setSelectedFile(null);
                dispatch(setUser(updatedUser.result));
            })
            .catch((error) => toast.error(error.message || "Failed to upload avatar"));
    };

    const cancelUpload = () => {
        setPreview(null);
        setSelectedFile(null);
    };

    const onRemove = () => {
        apiService
            .deleteAvatar(user.id)
            .then(() => {
                toast.success("Avatar removed successfully");
                return apiService.getUser(user.id);
            })
            .then((updatedUser) => {
                setSelectedFile(null);
                setPreview(null);
                dispatch(setUser(updatedUser.result));
            })
            .catch((error) => toast.error(error.message || "Failed to delete avatar"));
    };

    return (
        <div className="grid grid-cols-2 grid-rows-1 gap-4 items-center px-10 pb-4 space-x-4 border-b-2">
            <div className="flex flex-row items-center space-x-2">
                <div className="relative size-32 flex justify-center items-center rounded-full bg-gradient-to-r from-green-300 to-blue-300 shadow-md overflow-hidden">
                    <Image
                        className="rounded-full shadow-lg transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                        src={preview || user.avatar}
                        alt={user?.username}
                        width={128}
                        height={128}
                        onClick={onUpload}
                    />
                </div>
                <div>
                    <p className="text-3xl font-bold">{user?.name}</p>
                    <p className="text-gray-500 text-md">
                        {user?.username} | {user?.email}
                    </p>
                </div>
            </div>

            <div className="flex flex-row justify-end space-x-2">
                <Button
                    className="text-green-600 bg-white"
                    color="success"
                    variant="bordered"
                    onPress={() => setUploadModalOpen(true)}
                    startContent={<FiUpload />}>
                    Upload
                </Button>

                <Modal isOpen={isUploadModalOpen} onOpenChange={setUploadModalOpen} size="2xl">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Change Avatar</ModalHeader>
                                <ModalBody className="flex items-center justify-center">
                                    {preview ? (
                                        <Image
                                            className="rounded-full shadow-lg transition-opacity duration-200 cursor-pointer"
                                            src={preview}
                                            alt={user?.username}
                                            width={250}
                                            height={250}
                                            onClick={onUpload}
                                        />
                                    ) : (
                                        <div className="bg-gradient-to-r from-green-300 to-blue-300 rounded-full flex justify-center items-center size-[250px] border-2">
                                            <p className="text-gray-600 font-bold text-9xl">
                                                {user?.username?.charAt(0).toUpperCase()}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center justify-center opacity-80 transition-opacity duration-300 hover:opacity-100">
                                        <div className="font-semibold text-2xl">Drag & Drop</div>
                                        <div className="text-gray-500">-- or --</div>
                                        <button
                                            className="flex justify-center items-center w-36 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-2 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg"
                                            onClick={onUpload}>
                                            <FiUpload size={20} />
                                        </button>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" fullWidth onPress={() => onClose(cancelUpload())}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        fullWidth
                                        onPress={() => onClose(confirmUpload())}
                                        startContent={<FiUpload />}>
                                        Confirm Upload
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Button
                    className="text-red-500 bg-white"
                    color="danger"
                    variant="bordered"
                    onPress={() => setDeleteModalOpen(true)}
                    startContent={<IoMdTrash />}>
                    Delete
                </Button>

                <ConfirmDialog
                    title="Confirm Delete"
                    content="Are you sure you want to remove your avatar?"
                    isOpen={isDeleteModalOpen}
                    onOpenChange={setDeleteModalOpen}
                    onSubmit={onRemove}
                />
            </div>
        </div>
    );
};

const ChangePasswordTab = ({ user, isLoading }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const toggleCurrentPasswordVisibility = useCallback(() => setIsCurrentPasswordVisible((prev) => !prev), []);
    const togglePasswordVisibility = useCallback(() => setIsPasswordVisible((prev) => !prev), []);
    const toggleConfirmPasswordVisibility = useCallback(() => setIsConfirmPasswordVisible((prev) => !prev), []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        toast.success("Password changed successfully.");
        // if (!validateForm()) return;

        // try {
        //     let _otp = otp.join("");
        //     let dataJSON = { email, password, otp: _otp };
        //     let response = await apiService.resetPassword(dataJSON);
        //     if (response && response.ok) {
        //         setPassword("");
        //         setConfirmPassword("");
        //     }
        // } catch (error) {
        //     console.error("Failed to post user data:", error);
        //     setErrors((prev) => ({ ...prev, server: "An error occurred. Please try again." }));
        // }
    };

    const validateForm = () => {
        if (password !== confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
            setIsValids((prev) => ({ ...prev, confirmPassword: true }));
            return false;
        }
        return true;
    };

    return (
        <>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Change Password</h2>
                    <div className="flex flex-col max-w-lg space-y-4 w-full">
                        <Input
                            size="sm"
                            label="Current Password"
                            type={isCurrentPasswordVisible ? "text" : "password"}
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            endContent={
                                <button
                                    className="focus:outline-none opacity-60"
                                    type="button"
                                    onClick={toggleCurrentPasswordVisibility}
                                    aria-label="toggle password visibility">
                                    {isCurrentPasswordVisible ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
                                </button>
                            }
                        />

                        <Input
                            size="sm"
                            label="Password"
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        />

                        <Input
                            size="sm"
                            label="Confirm Password"
                            type={isConfirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        />
                    </div>

                    <div className="flex justify-end max-w-lg w-full pb-4">
                        <Button onClick={handleChangePassword} className="bg-blue-500 text-white mt-4">
                            Change Password
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

const OverviewTab = ({ user }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [province, setProvince] = useState(user?.provinceId);
    const [district, setDistrict] = useState(user?.districtId);
    const [ward, setWard] = useState(user?.wardId);

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
        Promise.all([apiService.getProvinces(), apiService.getDistricts(province), apiService.getWards(district)])
            .then(([provincesResponse, districtsResponse, wardsResponse]) => {
                setProvinces(provincesResponse.result);
                setDistricts(districtsResponse.result);
                setWards(wardsResponse.result);
            })
            .catch((error) => {
                toast.error(error.message);
                console.log(error.message);
            });
    }, []);
    return (
        <>
            <Avatar user={user} />

            <div className="grid grid-cols-2 grid-rows-1 px-5 pt-8 gap-4">
                <div className="flex">
                    <table aria-label="InfoTable" className="w-full border-collapse">
                        <tbody>
                            <tr>
                                <td className="font-bold text-sm p-2">Name</td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={user?.name}
                                        className="w-80 p-1 px-4 border-2 rounded-full"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="font-bold text-sm p-2">Username</td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={user?.username}
                                        className="w-80 p-1 px-4 border-2 rounded-full"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="font-bold text-sm p-2">Phone Number</td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={user?.phoneNumber}
                                        className="w-80 p-1 px-4 border-2 rounded-full"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="font-bold text-sm p-2">Email</td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={user?.email}
                                        className="w-80 p-1 px-4 border-2 rounded-full"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex">
                    <table aria-label="AddressTable" className="w-32 border-collapse">
                        <tbody>
                            <tr>
                                <td className="font-bold text-sm p-2 w-32">Address</td>
                                <td className="p-2">
                                    <input
                                        type="text"
                                        defaultValue={user?.address}
                                        className="w-72 p-1 px-4 border-2 rounded-full"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="font-bold text-sm p-2 w-32">Province</td>
                                <td className="p-2">
                                    <Autocomplete
                                        defaultItems={provinces}
                                        label="Province"
                                        selectedKey={province}
                                        variant="underlined"
                                        onSelectionChange={(selectedId) => {
                                            setProvince(selectedId);
                                            setDistricts([]);
                                            setWards([]);
                                            loadDistricts(selectedId);
                                        }}>
                                        {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                                    </Autocomplete>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-bold text-sm p-2 w-32">District</td>
                                <td className="p-2">
                                    <Autocomplete
                                        defaultItems={districts}
                                        label="District"
                                        selectedKey={district}
                                        variant="underlined"
                                        onSelectionChange={(selectedId) => {
                                            setDistrict(selectedId);
                                            setWards([]);
                                            loadWards(selectedId);
                                        }}>
                                        {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                                    </Autocomplete>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-bold text-sm p-2 w-32">Ward</td>
                                <td className="p-2">
                                    <Autocomplete
                                        defaultItems={wards}
                                        label="Ward"
                                        selectedKey={ward}
                                        variant="underlined"
                                        onSelectionChange={setWard}>
                                        {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                                    </Autocomplete>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

const OrdersTab = ({ router, user, isLoading }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [rating, setRating] = useState(0);
    const [orders, setOrders] = useState([]);

    function handleDataChange(newRating) {
        setRating(newRating);
    }

    const getUserOrders = async () => {
        apiService
            .getUserOrders(user.id)
            .then((orderRes) => {
                setOrders(orderRes.result);
            })
            .catch((error) => {
                console.log("Error: ", error);
                toast.error(error.message || "Failed to fetch orders");
            });
    };

    useEffect(() => {
        getUserOrders();
    }, []);

    async function handleSubmit(sub_order) {
        let content = document.getElementById("content").value;
        let dataJSON = {
            sub_orderId: sub_order.id,
            productId: sub_order.product.id,
            content,
            rating,
        };

        try {
            let response = await apiService.postFeedbackByProductId(dataJSON);

            if (response && response.ok) {
                toast.success("Thanks for your feedback.");
                getUserOrders();
            }
        } catch (error) {
            console.error("Failed to post user data:", error);
            toast.error("Error: ", error.message);
        }
    }

    return (
        <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Orders</h2>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-lg p-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="col-span-1">
                                <Image
                                    className="rounded-t-lg"
                                    src={order.product.images[0]}
                                    alt={order.product.name}
                                    width={200}
                                    height={100}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <p className="font-semibold text-gray-900 text-lg">{order.product.name}</p>
                                <p className="text-gray-600 text-sm">
                                    {sharedService.formatVietnamDong(order.price)}/{order.product.unitMeasure}
                                </p>
                                <p className="text-gray-600 text-sm">Quantity: {order.quantity}</p>
                                <p className="text-gray-600 text-sm">
                                    Total: {sharedService.formatVietnamDong(order.price * order.quantity)}
                                </p>
                            </div>
                            <div className="col-span-3 flex justify-end mt-4">
                                {order.isRating ? (
                                    <Button onClick={() => router.push(`/products/detail/${ order.product.id }`)}>
                                        Buy Again
                                    </Button>
                                ) : (
                                    <>
                                        <Button onPress={onOpen} className="px-4 py-2 text-sm">
                                            Add Review
                                        </Button>
                                        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                            <ModalContent>
                                                {(onClose) => (
                                                    <>
                                                        <ModalHeader className="flex flex-col gap-1">
                                                            Contribute Your Review
                                                        </ModalHeader>
                                                        <ModalBody>
                                                            <div className="flex flex-row items-center space-x-2">
                                                                <span className="text-gray-600">Rating:</span>
                                                                <StarRating
                                                                    onDataChange={handleDataChange}
                                                                    isChanged={true}
                                                                />
                                                            </div>
                                                            <Textarea
                                                                label="Your Review"
                                                                type="text"
                                                                id="content"
                                                                size="lg"
                                                            />
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button color="danger" variant="light" onPress={onClose}>
                                                                Close
                                                            </Button>
                                                            <Button
                                                                color="primary"
                                                                onPress={() => {
                                                                    handleSubmit(order);
                                                                    onClose();
                                                                }}>
                                                                Submit
                                                            </Button>
                                                        </ModalFooter>
                                                    </>
                                                )}
                                            </ModalContent>
                                        </Modal>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!isLoading && orders.length === 0 && (
                <div className="flex justify-center py-4">
                    <p className="text-gray-500">You don't have any orders yet.</p>
                </div>
            )}
            <div className="flex justify-center mt-4">
                <LinkButton href="/" label="Go to Home" />
            </div>
        </>
    );
};

const ManageProductsTab = ({ user, isLoading }) => {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddChange } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onOpenChange: onUpdateChange } = useDisclosure();

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let productFilter = {
            Filter: `OwnerId = "${ user.id }"`,
        };

        Promise.all([
            apiService.getProducts(productFilter),
            apiService.getDiscounts(),
            apiService.getProd_Categories(),
        ]).then(([products, discounts, categories]) => {
            setProducts(products.result.data);
            setDiscounts(discounts.result.data);
            setCategories(categories.result.data);
        });
    }, [user]);

    function handleDelete(id) {
        apiService
            .deleteProduct(id)
            .then(() => {
                toast.success("Product deleted successfully");
                onClear();
                closeDeleteDialog();
            })
            .catch((error) => {
                console.error("Error: ", error);
                toast.error(error.message || "Failed to delete product");
            });
    }

    function openDeleteDialog(product) {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    }

    function closeDeleteDialog() {
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
    }

    function handleUpdate(product) {
        setSelectedProduct(product);
        onUpdateOpen();
    }

    return (
        <>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <>
                    <div className="grid grid-cols-3 grid-rows-1 gap-4">
                        <div className="col-span-2 text-xl font-bold text-center">Manage Your Products</div>
                        <div className="col-start-3 flex justify-end">
                            <Button onClick={onAddOpen}>Add New Product</Button>
                            <AddProductFormModal
                                isOpen={isAddOpen}
                                onChange={onAddChange}
                                user={user}
                                categories={categories}
                                discounts={discounts}
                                mode={"Add"}
                            />
                        </div>
                    </div>

                    {products.length > 0 &&
                        products.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-row items-center space-x-4 p-4 bg-white shadow-md rounded-lg mb-4">
                                <div className="flex-shrink-0">
                                    <Image
                                        className="rounded-lg object-cover"
                                        src={item.images[0]}
                                        alt={item.name}
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.description || "No description available"}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => handleUpdate(item)}
                                        className="bg-blue-500 text-white hover:bg-blue-600">
                                        Update
                                    </Button>
                                    <AddProductFormModal
                                        key={item.id}
                                        isOpen={isUpdateOpen && selectedProduct?.id === item.id}
                                        onChange={onUpdateChange}
                                        user={user}
                                        categories={categories}
                                        discounts={discounts}
                                        product={item}
                                        mode={"Update"}
                                    />
                                    <Button
                                        className="bg-red-500 text-white hover:bg-red-600"
                                        onClick={() => openDeleteDialog(item)}>
                                        Delete
                                    </Button>
                                    <ConfirmDialog
                                        title={`Confirm Delete ${ selectedProduct?.name }`}
                                        content={`Are you sure you want to remove your ${ selectedProduct?.name }?`}
                                        isOpen={isDeleteDialogOpen && selectedProduct?.id === item.id}
                                        onOpenChange={setDeleteDialogOpen}
                                        onSubmit={() => handleDelete(item.id)}
                                        onCancel={closeDeleteDialog}
                                    />
                                </div>
                            </div>
                        ))}
                </>
            )}
        </>
    );
};

const AddProductFormModal = ({ isOpen, onChange, mode, user, categories, discounts, product = null }) => {
    const isAddMode = mode === "Add";

    const [name, setName] = useState("");
    const [category, setCategory] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isAddMode && product) {
            setName(name);
            setPrice(price);
            setDescription(description);
            setQuantity(quantity);
            setCategory(category);
            setDiscount(discount);
            setImages(images || []);
        } else {
            onClear();
        }
    }, [isAddMode, product]);

    function handleSubmit() {
        if (!validateForm()) {
            return;
        }

        if (isAddMode) {
            let dataJSON = {
                categoryId: category?.id,
                ownerId: user?.id,
                name,
                price,
                description,
                // quantity,
                discountId: discount?.id,
            };
            apiService
                .postProduct(dataJSON)
                .then(() => {
                    onChange();
                    toast.success("Product added successfully");
                    onClear();
                })
                .catch((error) => {
                    console.error("Error: ", error);
                    toast.error(error.message || "Failed to add product");
                });
        } else {
            let request = {
                categoryId: category?.id,
                ownerId: user?.id,
                name,
                price,
                description,
                // quantity,
                discountId: discount?.id,
            };

            let fields = [];
            for (let field of fields) {
                if (!request[field] || !sharedService.isNullOrEmpty(request[field])) {
                    delete request[field];
                }
            }

            let dataJSON = { request, fields };
            apiService
                .patchProduct(product.id, dataJSON)
                .then(() => {
                    onChange();
                    toast.success("Product updated successfully");
                })
                .catch((error) => {
                    console.error("Error: ", error);
                    toast.error(error.message || "Failed to update product");
                });
        }
    }

    function validateForm() {
        const newErrors = {};
        if (!name) newErrors.name = "Name is required.";
        if (!category) newErrors.category = "Category is required.";
        if (!price) newErrors.price = "Price is required.";
        if (!quantity) newErrors.quantity = "Quantity is required.";
        if (!discount) newErrors.discount = "Discount is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function onClear() {
        setName("");
        setCategory(null);
        setDiscount(null);
        setPrice("");
        setQuantity("");
        setDescription("");
        setImages([]);
        setErrors({});
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onChange} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}>
                        <ModalHeader className="flex flex-col gap-1">
                            {isAddMode ? "Add New Product" : "Update Product"}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Name"
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}

                            <Dropdown>
                                <DropdownTrigger>
                                    <Button variant="bordered" className="capitalize">
                                        {category ? category.name : product ? product.category : "Select Category"}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Select category"
                                    variant="flat"
                                    disallowEmptySelection={true}
                                    selectionMode="single"
                                    onSelectionChange={(key) => {
                                        const selectedCategory = categories.find((item) => item.id === Array.from(key)[0]);
                                        setCategory(selectedCategory);
                                    }}>
                                    {categories.map((item) => (
                                        <DropdownItem key={item.id} value={item.id}>
                                            {item.name ?? ""}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            {errors.category && <p className="text-red-500">{errors.category}</p>}

                            <Dropdown>
                                <DropdownTrigger>
                                    <Button variant="bordered" className="capitalize">
                                        {discount ? discount.name : "Select Discount Type"}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Select discount"
                                    variant="flat"
                                    disallowEmptySelection={true}
                                    selectionMode="single"
                                    onSelectionChange={(key) => {
                                        const selectedDiscount = discounts.find((item) => item.id === Array.from(key)[0]);
                                        setDiscount(selectedDiscount);
                                    }}>
                                    {discounts.map((item) => (
                                        <DropdownItem key={item.id} value={item.id}>
                                            {item.summary}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            {errors.discount && <p className="text-red-500">{errors.discount}</p>}

                            <Input
                                label="Price"
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            {errors.price && <p className="text-red-500">{errors.price}</p>}

                            <Input
                                label="Quantity"
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}

                            <Textarea
                                label="Description"
                                id="description"
                                placeholder="Enter your description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onClick={() => {
                                    onClear();
                                    onClose();
                                }}>
                                Close
                            </Button>
                            <Button color="primary" type="submit">
                                {isAddMode ? "Add Product" : "Update Product"}
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
};
