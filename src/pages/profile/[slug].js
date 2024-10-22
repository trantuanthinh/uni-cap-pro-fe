"use client";

import LinkButton from "@/components/shared/buttons/link-button";
import ConfirmDialog from "@/components/shared/default-confirm-dialog";
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
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddChange } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onOpenChange: onUpdateChange } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange } = useDisclosure();
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        Promise.all([apiService.getDiscounts(), apiService.getProd_Categories()]).then(([discounts, categories]) => {
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
            })
            .catch((error) => {
                console.error("Error: ", error);
                toast.error(error.message || "Failed to delete product");
            });
    }

    function openDialog(id) {
        setSelectedProduct(id);
        setDialogOpen(true);
    }

    function closeDialog() {
        setDialogOpen(false);
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
                            <FormModal
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
                            <div key={item.id} className="flex flex-row items-center space-x-4">
                                <div className="flex justify-center">
                                    <Image
                                        className="rounded-lg object-cover"
                                        src={item.images[0]}
                                        alt={item.name}
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <span>{item.name}</span>
                                <Button onClick={() => handleUpdate(item)}>Update</Button>
                                <FormModal
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
                                    className="hover:bg-danger-300"
                                    onClick={() => openDialog(item.id)}
                                    color="danger"
                                    variant="flat">
                                    Delete
                                </Button>
                                <ConfirmDialog
                                    title={`Confirm Delete ${ item.name }`}
                                    content={`Are you sure you want to remove your ${ item.name }?`}
                                    isOpen={isDeleteOpen && selectedProduct?.id === item.id}
                                    onOpenChange={closeDialog}
                                    onSubmit={() => handleDelete(item.id)}
                                />
                            </div>
                        ))}
                </>
            )}
        </>
    );
};

const FormModal = ({ isOpen, onChange, mode, user, categories, discounts, product = null }) => {
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
            console.log("🚀 ~ useEffect ~ isAddMode:", isAddMode);
            const { name, price, description, quantity, category, discount, images } = product;
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

            let fields = Object.keys(request);
            for (const field of fields) {
                if (!request[field]) {
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
                                        {category ? category.name : "Select Category"}
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
