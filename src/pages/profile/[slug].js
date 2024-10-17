"use client";

import LinkButton from "@/components/shared/buttons/link-button";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import {
    Button,
    Card,
    CardBody,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tab,
    Tabs,
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function ProfileLayout() {
    const user = useSelector((state) => state.user);
    const router = useRouter();
    const { slug } = router.query;

    const [activeTab, setActiveTab] = useState("Overview");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const tabs = [
        {
            key: "Overview",
            title: "Overview",
            content: <OverviewTab user={user} />,
        },
        {
            key: "OrderContent",
            title: "OrderContent",
            content: <OrdersTab orders={orders} isLoading={isLoading} />,
        },
        {
            key: "ManageProduct",
            title: "Manage Products",
            content: <ManageProductsTab user={user} products={products} isLoading={isLoading} />,
        },
    ];

    useEffect(() => {
        if (router.isReady && user) {
            //temporary
            if (slug === user.username) {
                router.push({
                    query: { slug: user.username },
                });
                let productFilter = {
                    Filter: `OwnerId = "${ user.id }"`,
                };
                Promise.all([
                    apiService
                        .getProducts(productFilter)
                        .then((productRes) => {
                            setProducts(productRes.result.data);
                        })
                        .catch((error) => {
                            toast.error(error.message || "Failed to fetch products");
                        }),
                    apiService
                        .getUserOrders(user.id)
                        .then((orderRes) => {
                            setOrders(orderRes.result);
                        })
                        .catch((error) => {
                            console.log("Error: ", error);
                            toast.error(error.message || "Failed to fetch orders");
                        }),
                ]).finally(() => {
                    setIsLoading(false);
                });
            }
        }
    }, [router.isReady, slug, user]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - ${ user?.username }`} />
            {isMounted && user ? (
                <div className="max-w-screen-lg mx-auto py-10 px-6">
                    <div className="flex items-center space-x-8 mb-10">
                        <div className="w-28 h-28 flex justify-center items-center rounded-full bg-gradient-to-r from-green-300 to-blue-500 shadow-md overflow-hidden">
                            <Avatar avatar={user?.avatar} username={user?.username} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
                            <p className="text-gray-500">Joined In: {sharedService.formatDate(user?.created_At)}</p>
                        </div>
                    </div>

                    <div className="mb-8 border-b border-gray-200 pb-4">
                        <Tabs aria-label="Profile Options" radius="md" color="primary" variant="underline">
                            {tabs.map((tab) => (
                                <Tab key={tab.key} title={tab.title}>
                                    <Card className="bg-white shadow-lg rounded-lg">
                                        <CardBody>{tab.content}</CardBody>
                                    </Card>
                                </Tab>
                            ))}
                        </Tabs>
                    </div>
                </div>
            ) : (
                <LoadingIndicator />
            )}
        </>
    );
}

const LoadingIndicator = () => (
    <div className="flex justify-center py-10">
        <p className="text-gray-600">Loading...</p>
    </div>
);

const Avatar = ({ avatar = null, username }) =>
    avatar ? (
        <Image className="rounded-full shadow-lg" src={avatar} alt={username} width={96} height={96} />
    ) : (
        <span className="text-gray-600 font-bold text-5xl">{username?.charAt(0).toUpperCase()}</span>
    );

const OverviewTab = ({ user }) => {
    return (
        <>
            <p className="text-gray-700">Gmail: {user?.email}</p>
            <p className="text-gray-700">Phone Number: {user?.phoneNumber}</p>
            <p className="text-gray-700">Description: {user?.description}</p>
            <p className="text-gray-700">Type: {user?.user_Type}</p>
        </>
    );
};

const OrdersTab = ({ orders, isLoading }) => {
    return (
        <>
            <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
            {isLoading ? (
                <LoadingIndicator />
            ) : orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.id} className="mb-6 flex flex-row items-center space-x-4">
                        <Image
                            className="rounded-lg shadow-md"
                            src={order.product.images[0]}
                            alt={order.product.name}
                            width={100}
                            height={100}
                        />
                        <div className="flex flex-col space-y-1">
                            <p className="font-semibold text-gray-900">{order.name}</p>
                            <p className="text-gray-600">Product: {order.product.name}</p>
                            <p className="text-gray-600">Quantity: {order.quantity}</p>
                            <p className="text-gray-600">Unit Price: {order.price}</p>
                            <p className="text-gray-600">
                                Total: {sharedService.formatVietnamDong(order.price * order.quantity)}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex justify-center py-4">
                    <p className="text-gray-500">You don't have any orders yet.</p>
                </div>
            )}
            <div className="flex justify-center">
                <LinkButton href="/" label="Go to Home" />
            </div>
        </>
    );
};

const ManageProductsTab = ({ user, products, isLoading }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [errors, setErrors] = useState({});

    const [name, setName] = useState("");
    const [category, setCategory] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);

    useEffect(() => {
        Promise.all([apiService.getDiscounts(), apiService.getProd_Categories()]).then(([discounts, categories]) => {
            setDiscounts(discounts.result.data);
            setCategories(categories.result.data);
        });
    }, [user]);

    function handleAddProduct() {
        if (!validateForm()) {
            return;
        }

        const dataJSON = {
            categoryId: category.id,
            ownerId: user.id,
            name,
            price,
            description,
            discountId: discount.id,
        };

        apiService
            .postProduct(dataJSON)
            .then(() => {
                onClose();
                toast.success("Product added successfully");
                onClear();
            })
            .catch((error) => {
                console.error("Error: ", error);
                toast.error(error.message || "Failed to add product");
            });
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
        <>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <>
                    {products.length > 0 && (
                        <ul>
                            {products.map((discount) => (
                                <li key={discount.id}>{discount.name}</li>
                            ))}
                        </ul>
                    )}
                    <Button onClick={onOpen}>Add New Product</Button>
                    <Modal isOpen={isOpen} onOpenChange={onClose}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleAddProduct();
                                        }}>
                                        <ModalHeader className="flex flex-col gap-1">Add New Product</ModalHeader>
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
                                                        {category ? category.name : "Select Category"}
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu
                                                    aria-label="Single selection example"
                                                    variant="flat"
                                                    disallowEmptySelection
                                                    selectionMode="single"
                                                    onSelectionChange={(key) => {
                                                        const selectedCategory = categories.find(
                                                            (item) => item.id === Array.from(key)[0]
                                                        );
                                                        setCategory(selectedCategory);
                                                    }}>
                                                    {categories.map((item) => (
                                                        <DropdownItem key={item.id} value={item.id}>
                                                            {item.name}
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
                                                    aria-label="Single selection example"
                                                    variant="flat"
                                                    disallowEmptySelection
                                                    selectionMode="single"
                                                    onSelectionChange={(key) => {
                                                        const selectedDiscount = discounts.find(
                                                            (item) => item.id === Array.from(key)[0]
                                                        );
                                                        setDiscount(selectedDiscount);
                                                    }}>
                                                    {discounts.map((item) => (
                                                        <DropdownItem key={item.id} value={item.id}>
                                                            {item.id}
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
                                                Add Product
                                            </Button>
                                        </ModalFooter>
                                    </form>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    );
};
