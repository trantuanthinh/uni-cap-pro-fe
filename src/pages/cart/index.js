"use client";

import CartList from "@/components/shared/lists/cart-list";
import CheckoutList from "@/components/shared/lists/checkout-list";
import GroupCartList from "@/components/shared/lists/group-cart-list";
import Title from "@/components/shared/title";
import { CartType } from "@/configurations/data-settings";
import GlobalSettings from "@/configurations/global-settings";
import { removeItemFromCart } from "@/redux/slicers/cartSlice";
import { removeItemFromCheckout, resetCheckoutCart } from "@/redux/slicers/checkoutSlice";
import { removeItemFromGroupCart } from "@/redux/slicers/groupCartSlice";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const checkout = useSelector((state) => state.checkout);
    const groupCart = useSelector((state) => state.groupCart);

    const [activeTab, setActiveTab] = useState("cart");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const removeItem = (type, id) => {
        switch (type) {
            case "cart":
                dispatch(removeItemFromCart(id));
                dispatch(removeItemFromCheckout(id));
                break;
            case "group-cart":
                dispatch(removeItemFromGroupCart(id));
                dispatch(removeItemFromCheckout(id));
                break;
            default:
                break;
        }
    };

    const renderTabContent = () => {
        if (activeTab === "cart") {
            return (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold pb-2">Cart Items</h2>
                        {cart.items.length > 0 ? (
                            <CartList
                                items={cart.items}
                                removeFromCart={(id) => removeItem(CartType.cart, id)}
                                removeFromCheckout={(id) => dispatch(removeItemFromCheckout(id))}
                            />
                        ) : (
                            <p className="text-gray-500">Your cart is currently empty.</p>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold pb-2">Group Cart Items</h2>
                        {groupCart.items.length > 0 ? (
                            <GroupCartList
                                items={groupCart.items}
                                removeFromGroupCart={(id) => removeItem(CartType.shared_cart, id)}
                                removeFromCheckout={(id) => dispatch(removeItemFromCheckout(id))}
                            />
                        ) : (
                            <p className="text-gray-500">Your group cart is empty.</p>
                        )}
                    </div>
                    <div className="text-right">
                        <Button color="primary" onClick={() => setActiveTab("checkout")}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            );
        }

        if (activeTab === "checkout") {
            return (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Checkout Items</h2>
                    <CheckoutList items={checkout.items} user={user} removeItem={(type, id) => removeItem(type, id)} />
                    <div className="text-right space-x-2">
                        <Button
                            color="danger"
                            onClick={() => {
                                setActiveTab("cart");
                                dispatch(resetCheckoutCart());
                            }}>
                            Back to Cart
                        </Button>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Cart`} />
            <div className="h-full container mx-auto py-8 px-8">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                <p className="text-lg mb-6">Review the items in your cart and complete your purchase.</p>
                <div className="tabs flex gap-2 mb-1">
                    <button disabled className={`px-4 py-2 ${ activeTab === "cart" ? "bg-blue-300" : "bg-gray-100" } rounded`}>
                        Cart
                    </button>
                    <button
                        disabled
                        className={`px-4 py-2 ${ activeTab === "checkout" ? "bg-blue-300" : "bg-gray-100" } rounded`}>
                        Checkout
                    </button>
                </div>
                {isMounted && <div className="border p-4 rounded">{renderTabContent()}</div>}
            </div>
        </>
    );
}
