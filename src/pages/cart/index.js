"use client";

import Dialog from "@/components/shared/default-dialog";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { decrementQuantity, incrementQuantity, removeItemFromCart, resetCart } from "@/redux/slicers/cartSlice";
import { addItemToCheckout, removeItemFromCheckout } from "@/redux/slicers/checkoutSlice";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Tab,
    Tabs,
} from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const checkout = useSelector((state) => state.checkout);
    const user = useSelector((state) => state.user);
    const [ haveProduct, setHaveProduct ] = useState(false);

    const [ activeTab, setActiveTab ] = useState("cart");
    // const [ activeTab, setActiveTab ] = useState("checkout");

    function removeFromCheckout(id) {
        dispatch(removeItemFromCheckout(id));
    }

    function removeFromCart(id) {
        dispatch(removeItemFromCart(id));
        removeFromCheckout(id);
    }

    useEffect(() => {
        setHaveProduct(cart.items.length > 0);
        if (cart.items.length === 0) {
            dispatch(resetCart());
        }
    }, [ cart.items, dispatch ]);

    return (
        <>
            <Title label={ `${ GlobalSettings.Settings.name } - Cart` } />
            <div className="h-full container mx-auto py-8">
                <div>
                    <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                </div>
                <div>
                    <h3 className="text-2xl mb-6">Review the items in your cart and complete your purchase.</h3>
                </div>
                <Tabs aria-label="Item Tabs" selectedKey={ activeTab } className="hidden">
                    <Tab title="Cart Items" key="cart">
                        <Card>
                            <CardBody className="space-y-2">
                                { haveProduct ? (
                                    <CartList
                                        items={ cart.items }
                                        removeFromCheckout={ removeFromCheckout }
                                        removeFromCart={ removeFromCart }
                                    />
                                ) : (
                                    <p>Don't Have Any Items In Your Cart</p>
                                ) }
                            </CardBody>
                            <CardFooter className="flex justify-end">
                                <Button onClick={ () => setActiveTab("checkout") }>Checkout</Button>
                            </CardFooter>
                        </Card>
                    </Tab>

                    <Tab title="Checkout Items" key="checkout">
                        <Card>
                            <CardBody className="space-y-2">
                                <CheckoutList items={ checkout.checkoutItems } />
                            </CardBody>
                            <CardFooter className="flex justify-end space-x-5">
                                <Button onClick={ () => setActiveTab("cart") } color="danger">
                                    Back
                                </Button>
                            </CardFooter>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
        </>
    );
}

const CartList = ({ items, removeFromCheckout, removeFromCart }) => {
    const dispatch = useDispatch();
    const [ dialogIdInfo, setDialogIdInfo ] = useState(null);
    const [ selected, setSelected ] = useState([]);

    function openDialog(itemId) {
        setDialogIdInfo(itemId);
    }

    function closeDialog() {
        setDialogIdInfo(null);
    }

    function handleIncrement(id) {
        dispatch(incrementQuantity(id));
        if (!selected.includes(id)) {
            setSelected([ ...selected, id ]); // Ensure the item is selected when quantity increases
        }
    }

    function handleDecrement(id) {
        dispatch(decrementQuantity(id));
        if (items.find((item) => item.id === id)?.totalItemQuantity <= 1) {
            setSelected(selected.filter((itemId) => itemId !== id)); // Remove the item from selected if quantity goes to zero
        }
    }

    function addToCheckout(item) {
        dispatch(addItemToCheckout(item));
    }

    return (
        <CheckboxGroup label="Select Items" value={ selected } onValueChange={ setSelected }>
            { items?.map((item) => {
                const formattedPrice = sharedService.formatVietnamDong(item?.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(item?.totalItemQuantity * item?.price);

                const isDialogOpen = dialogIdInfo === item.id;

                return (
                    <div key={ item.id } className="grid grid-cols-[20px_100px_1fr_auto] items-center gap-4 border-b pb-4">
                        <Checkbox
                            value={ item.id }
                            isSelected={ selected.includes(item.id) }
                            onChange={ () => {
                                if (selected.includes(item.id)) {
                                    setSelected(selected.filter((itemId) => itemId !== item.id)); // Uncheck
                                } else {
                                    setSelected([ ...selected, item.id ]); // Check
                                }
                            } }
                        />
                        <div className="flex justify-center">
                            <div className="flex border-4 size-32 rounded-lg border-rich-brown mb-2">
                                <Image
                                    className="rounded-lg object-cover"
                                    src={ item.images[ 0 ] }
                                    alt={ item.name }
                                    width={ 100 }
                                    height={ 100 }
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="font-bold text-xl">{ item.name }</p>
                            <span className="text-red-500">{ formattedPrice }</span>
                            <div className="col-span-2">
                                <p className="text-lg font-semibold">Total Price: { formattedTotalPrice }</p>
                            </div>
                        </div>

                        <div className="grid grid-flow-row gap-3">
                            <ButtonGroup>
                                <Button className="hover:bg-success-500" onClick={ () => handleDecrement(item.id) }>
                                    <IoMdRemoveCircleOutline size={ 24 } />
                                </Button>
                                <div className="w-12 flex justify-center">
                                    <p className="mx-4 text-xl font-bold">{ item.totalItemQuantity }</p>
                                </div>
                                <Button className="hover:bg-success-500" onClick={ () => handleIncrement(item.id) }>
                                    <IoMdAddCircleOutline size={ 24 } />
                                </Button>
                                <Button
                                    className="hover:bg-danger-300"
                                    onClick={ () => openDialog(item.id) }
                                    color="danger"
                                    variant="flat">
                                    <FaTrash />
                                </Button>
                            </ButtonGroup>
                            {/* Dialog for confirming item removal */ }
                            <Dialog
                                title={ `Confirm Remove ${ item.name }` }
                                content={ `Are you sure you want to remove ${ item.name } from your cart?` }
                                isOpen={ isDialogOpen }
                                onOpenChange={ closeDialog }
                                onSubmit={ () => removeFromCart(item.id) }
                            />
                            <RadioGroup label="Select your buy type">
                                <div className="flex flex-row space-x-2">
                                    <Radio value={ `${ item.id }-personal` }>Personal Buy</Radio>
                                    <Radio value={ `${ item.id }-shared` }>Shared Buy</Radio>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                );
            }) }
        </CheckboxGroup>
    );
};

const CheckoutList = ({ items }) => {
    const [ dialogIdInfo, setDialogIdInfo ] = useState(null);

    function openDialog(itemId) {
        setDialogIdInfo(itemId);
    }

    function closeDialog() {
        setDialogIdInfo(null);
    }

    async function handleOrder(item, isShare) {
        let dataJson = {
            productId: item?.id,
            userId: user?.id,
            quantity: item?.totalItemQuantity,
            price: item?.price * item?.totalItemQuantity,
            isShare: isShare,
        };
        try {
            let response = await apiService.postOrder(dataJson);
            if (response.ok) {
                removeItemFromCart(item.id);
                removeFromCheckout(item.id);
                toast.success("Order created successfully");
            }
        } catch (error) {
            console.log("Error: ", error.message);
        }
    }
    return (
        <>
            { items?.map((item, index) => {
                const formattedPrice = sharedService.formatVietnamDong(item?.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(item?.totalItemQuantity * item?.price);

                const isDialogOpen = dialogIdInfo === item.id;

                return (
                    <div key={ item.id } className="grid grid-cols-[100px_1fr_auto] items-center gap-4 border-b pb-4">
                        <div className="flex justify-center">
                            <div className="flex border-4 size-32 rounded-lg border-rich-brown mb-2">
                                <Image
                                    className="rounded-lg object-cover"
                                    src={ item.images[ 0 ] }
                                    alt={ item.name }
                                    width={ 100 }
                                    height={ 100 }
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="font-bold text-xl">{ item.name }</p>
                            <span className="text-red-500">{ formattedPrice }</span>
                            <div className="col-span-2">
                                <p className="text-lg font-semibold">Total Price: { formattedTotalPrice }</p>
                            </div>
                        </div>

                        <div className="grid grid-flow-row gap-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    className="hover:bg-danger-300"
                                    onClick={ () => openDialog(item.id) }
                                    color="success"
                                    variant="flat">
                                    Buy
                                </Button>
                                { isDialogOpen && (
                                    <Dialog
                                        title={ `Confirm Buy ${ item.name }` }
                                        content={ `Are you sure you want to remove ${ item.name } from your cart?` }
                                        isOpen={ isDialogOpen }
                                        onOpenChange={ closeDialog }
                                        onSubmit={ () => handleOrder(item.id) }
                                    />
                                ) }
                            </div>
                        </div>
                    </div>
                );
            }) }
        </>
    );
};
