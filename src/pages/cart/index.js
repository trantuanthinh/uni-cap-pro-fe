"use client";

import CartList from "@/components/shared/cart-list";
import CheckoutList from "@/components/shared/checkout-list";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { removeItemFromCart, resetCart } from "@/redux/slicers/cartSlice";
import { removeItemFromCheckout, resetCheckoutCart } from "@/redux/slicers/checkoutSlice";
import apiService from "@/services/api-service";
import { Button, Card, CardBody, CardFooter, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const checkout = useSelector((state) => state.checkout);
    const [ haveProduct, setHaveProduct ] = useState(false);

    const [ activeTab, setActiveTab ] = useState("cart");

    function removeFromCheckout(id) {
        dispatch(removeItemFromCheckout(id));
    }

    function removeFromCart(id) {
        dispatch(removeItemFromCart(id));
        removeFromCheckout(id);
    }

    async function handleOrder(item) {
        let dataJson = {
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
        }
    }

    useEffect(() => {
        setHaveProduct(cart.items.length > 0);
        dispatch(resetCheckoutCart());
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
                                <CheckoutList items={ checkout.items } handleOrder={ handleOrder } />
                            </CardBody>
                            <CardFooter className="flex justify-end space-x-5">
                                <Button
                                    radius="lg"
                                    onClick={ () => {
                                        setActiveTab("cart");
                                        dispatch(resetCheckoutCart());
                                    } }
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
