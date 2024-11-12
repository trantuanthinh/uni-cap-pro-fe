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
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { IoIosRemoveCircleOutline, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
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
                <div className="min-h-full mx-auto pb-10 px-6">
                    <BackGround user={user} />
                    {/* <div className="flex items-center space-x-8">
                        <Avatar user={user} />

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
                            <p className="text-gray-500">Joined In: {sharedService.formatToDate(user?.created_At)}</p>
                        </div>
                    </div> */}

                    <div className="flex flex-row border-t-2 mt-5">
                        <div className="basis-1/6">
                            <Accordion defaultExpandedKeys={["YourProfile"]}>
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

                        <div className="basis-5/6 overflow-auto p-4">
                            {tabs.map(
                                (tab, index) =>
                                    tab.key === currentTab && (
                                        <Card key={index} className="bg-white shadow-lg rounded-lg mb-4">
                                            <CardBody>{tab.content}</CardBody>
                                        </Card>
                                    )
                            )}
                        </div>
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
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const dispatch = useDispatch();

    const handleMouseOver = () => setIsMouseOver(true);
    const handleMouseLeave = () => setIsMouseOver(false);

    const onUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file.size > MAX_FILE_SIZE) {
                toast.error("File size exceeds the limit of 5 MB.");
                return;
            }
            if (file) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
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
            .catch((error) => {
                console.error("Error: ", error);
                toast.error(error.message || "Failed to upload avatar");
            });
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
            .catch((error) => {
                console.error("Error: ", error);
                toast.error(error.message || "Failed to delete avatar");
            });
    };

    return (
        <>
            <div
                className="relative size-32 flex justify-center items-center rounded-full bg-gradient-to-r from-green-300 to-blue-300 shadow-md overflow-hidden"
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}>
                {preview ? (
                    <Image
                        className="rounded-full shadow-lg transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                        src={preview}
                        alt={user?.username}
                        width={128}
                        height={128}
                        onClick={onUpload}
                    />
                ) : user?.avatar ? (
                    <Image
                        className="rounded-full shadow-lg transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                        src={user.avatar}
                        alt={user?.username}
                        width={128}
                        height={128}
                        onClick={onUpload}
                    />
                ) : (
                    <span className="text-gray-600 font-bold text-6xl">{user?.username?.charAt(0).toUpperCase()}</span>
                )}

                {isMouseOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
                        <div className="flex space-x-4">
                            <button onClick={onRemove} aria-label="Remove Avatar" className="text-white text-2xl">
                                <IoIosRemoveCircleOutline />
                            </button>

                            <button onClick={onUpload} aria-label="Upload Avatar" className="text-white text-2xl">
                                <MdOutlineFileUpload />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {preview && (
                <>
                    <div className="flex flex-row pt-4 space-x-4">
                        <Button onClick={cancelUpload} size="sm" aria-label="Cancel Upload" className="text-white">
                            Cancel
                        </Button>

                        <Button onClick={confirmUpload} size="sm" aria-label="Confirm Upload" className="text-white">
                            Confirm
                        </Button>
                    </div>
                </>
            )}
        </>
    );
};

const BackGround = ({ user }) => {
    const [background, setBackground] = useState(null);

    useEffect(() => {
        if (user?.background) {
            setBackground(user.background);
        }
    }, [user]);

    const handleChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackground(reader.result);
            };
            reader.readAsDataURL(file);
            g;
        }
    };

    return (
        <>
            <div className="relative min-h-48 max-w-screen-2xl rounded-b-lg bg-gradient-to-r from-blue-300 to-green-300">
                <div className="absolute top-3/4 left-1/4 transform -translate-x-[150%] -translate-y-1/3">
                    <Avatar user={user} />
                </div>
            </div>
        </>
        // <div className=" bg-slate-400 size-80">
        //     {background && (
        //         <Image
        //             src={background}
        //             alt="background"
        //             className="absolute inset-0 w-full h-full object-cover"
        //             layout="fill"
        //         />
        //     )}
        //     <input type="file" accept="image/*" className="hidden" id="background-input" onChange={handleChange} />
        //     <label htmlFor="background-input" className="absolute inset-0 flex items-center justify-center cursor-pointer">
        //         <div className="text-white text-2xl">{background ? "Change Background" : "Add Background"}</div>
        //     </label>
        // </div>
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
                            label="Current Password"
                            type={isCurrentPasswordVisible ? "text" : "password"}
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleCurrentPasswordVisibility}
                                    aria-label="toggle password visibility">
                                    {isCurrentPasswordVisible ? <IoMdEye size={24} /> : <IoMdEyeOff size={24} />}
                                </button>
                            }
                        />

                        <Input
                            label="Password"
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        />

                        <Input
                            label="Confirm Password"
                            type={isConfirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
    return (
        <>
            <div className="flex justify-end">
                <button className="text-blue-500 hover:underline" onClick={() => updateUserInfo("email")}>
                    Edit
                </button>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Gmail:</span>
                    <span className="text-gray-700">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Phone Number:</span>
                    <span className="text-gray-700">{user?.phoneNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Description:</span>
                    <span className="text-gray-700">{user?.description}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="text-gray-700">{user?.user_Type}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Province:</span>
                    <span className="text-gray-700">{user?.Province}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">District:</span>
                    <span className="text-gray-700">{user?.District}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Ward:</span>
                    <span className="text-gray-700">{user?.Ward}</span>
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
            toast.error("Error:11111111 ", error.message);
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
