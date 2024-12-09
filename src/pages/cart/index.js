"use client";

import CartList from "@/components/shared/lists/cart-list";
import CheckoutList from "@/components/shared/lists/checkout-list";
import GroupCartList from "@/components/shared/lists/group-cart-list";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { clearCart, removeItemFromCart } from "@/redux/slicers/cartSlice";
import { removeItemFromCheckout, resetCheckoutCart } from "@/redux/slicers/checkoutSlice";
import { clearGroupCart, removeItemFromGroupCart } from "@/redux/slicers/groupCartSlice";
import apiService from "@/services/api-service";
import { Button, Card, CardBody, CardFooter, Divider, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Cart() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const checkout = useSelector((state) => state.checkout);
    const groupCart = useSelector((state) => state.groupCart);
    const [haveProduct, setHaveProduct] = useState(false);
    const [haveJoinedProduct, setHaveJoinedProduct] = useState(false);

    const [activeTab, setActiveTab] = useState("cart");

    function removeFromCheckout(id) {
        dispatch(removeItemFromCheckout(id));
    }

    function removeFromCart(id) {
        dispatch(removeItemFromCart(id));
        removeFromCheckout(id);
    }

    function removeFromGroupCart(id) {
        dispatch(removeItemFromGroupCart(id));
        removeFromCheckout(id);
    }

    async function handleOrder(item) {
        let dataJson;
        switch (item.cart_type) {
            case "cart":
                dataJson = {
                    productId: item?.id,
                    userId: user?.id,
                    quantity: item?.totalItemQuantity,
                    price: item?.price * item?.totalItemQuantity,
                    isShare: item.isShare,
                };
                try {
                    let response = await apiService.postOrder(dataJson);
                    if (response.ok) {
                        removeFromCheckout(item.id);
                        removeFromCart(item.id);
                        toast.success("Order created successfully");
                    }
                } catch (error) {
                    console.log("Error: ", error.message);
                    toast.error("Error: ", error.message);
                }
                break;
            case "group-cart":
                dataJson = {
                    userId: user?.id,
                    quantity: item?.totalItemQuantity,
                    price: item?.product.price * item?.totalItemQuantity,
                };
                try {
                    let response = await apiService.postBuyTogetherOrder(item.id, dataJson);
                    if (response.ok) {
                        removeFromCheckout(item.id);
                        removeFromGroupCart(item.id);
                        toast.success("Order created successfully");
                    }
                } catch (error) {
                    console.log("Error: ", error.message);
                    toast.error("Error: ", error.message);
                }
                break;
            default:
                toast.error("Something went wrong");
                break;
        }
    }

    useEffect(() => {
        setHaveProduct(cart.items.length > 0);
        // dispatch(resetCheckoutCart());
        if (cart.items.length === 0) {
            dispatch(clearCart());
        }
    }, [cart.items, dispatch]);

    useEffect(() => {
        setHaveJoinedProduct(groupCart.items.length > 0);
        // dispatch(resetCheckoutCart());
        if (groupCart.items.length === 0) {
            dispatch(clearGroupCart());
        }
    }, [groupCart.items, dispatch]);

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Cart`} />
            <div className="h-full container mx-auto py-8 px-8">
                <div>
                    <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                </div>
                <div>
                    <h3 className="text-2xl mb-6">Review the items in your cart and complete your purchase.</h3>
                </div>
                <Tabs aria-label="Item Tabs" selectedKey={activeTab} className="hidden">
                    <Tab title="Cart Items" key="cart">
                        <Card>
                            <CardBody className="space-y-2">
                                {haveProduct ? (
                                    <CartList
                                        items={cart.items}
                                        removeFromCheckout={removeFromCheckout}
                                        removeFromCart={removeFromCart}
                                    />
                                ) : (
                                    <div className="flex justify-center items-center py-6">
                                        <p className="text-lg text-gray-500">Your cart is currently empty.</p>
                                    </div>
                                )}
                            </CardBody>
                            <div className="flex justify-center flex-row w-full">
                                <Divider className="w-80" />
                            </div>
                            <CardBody className="space-y-2">
                                {haveJoinedProduct ? (
                                    <GroupCartList
                                        items={groupCart.items}
                                        removeFromCheckout={removeFromCheckout}
                                        removeFromGroupCart={removeFromGroupCart}
                                    />
                                ) : (
                                    <div className="flex justify-center items-center py-6">
                                        <p className="text-lg text-gray-500">Don't have any items in your group cart.</p>
                                    </div>
                                )}
                            </CardBody>
                            <div className="flex justify-end flex-row w-full">
                                <Divider className="w-80" />
                            </div>
                            <CardFooter className="flex justify-end">
                                <Button onClick={() => setActiveTab("checkout")}>Checkout</Button>
                            </CardFooter>
                        </Card>
                    </Tab>

                    <Tab title="Checkout Items" key="checkout">
                        <Card>
                            <CardBody className="space-y-2">
                                <CheckoutList items={checkout.items} handleOrder={handleOrder} />
                            </CardBody>
                            <CardFooter className="flex justify-end space-x-5">
                                <Button
                                    radius="lg"
                                    onClick={() => {
                                        setActiveTab("cart");
                                        dispatch(resetCheckoutCart());
                                    }}
                                    color="danger">
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
