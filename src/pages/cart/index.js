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
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Cart() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const checkout = useSelector((state) => state.checkout);
    const groupCart = useSelector((state) => state.groupCart);

    const [activeTab, setActiveTab] = useState("cart");

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

    const handleOrder = async (item) => {
        const data = {
            userId: user.id,
            quantity: item.totalItemQuantity,
            price: item.price * item.totalItemQuantity,
            isShare: item.isShare,
        };

        try {
            let response;
            if (item.cart_type === "cart") {
                response = await apiService.postOrder(data);
                removeItem("cart", item.id);
            } else if (item.cart_type === "group-cart") {
                response = await apiService.postBuyTogetherOrder(item.id, data);
                removeItem("group-cart", item.id);
            }

            if (response?.ok) {
                toast.success("Order created successfully");
            }
        } catch (error) {
            console.error("Error: ", error.message);
            toast.error("Error: " + error.message);
        }
    };

    useEffect(() => {
        if (cart.items.length === 0) {
            dispatch(clearCart());
        }
    }, [cart.items, dispatch]);

    useEffect(() => {
        if (groupCart.items.length === 0) {
            dispatch(clearGroupCart());
        }
    }, [groupCart.items, dispatch]);

    const renderTabContent = () => {
        if (activeTab === "cart") {
            return (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Cart Items</h2>
                        {cart.items.length > 0 ? (
                            <CartList items={cart.items} removeFromCart={(id) => removeItem("cart", id)} />
                        ) : (
                            <p className="text-gray-500">Your cart is currently empty.</p>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Group Cart Items</h2>
                        {groupCart.items.length > 0 ? (
                            <GroupCartList
                                items={groupCart.items}
                                removeFromGroupCart={(id) => removeItem("group-cart", id)}
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
                    <CheckoutList items={checkout.items} handleOrder={handleOrder} />
                    <div className="text-right">
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
                <div className="tabs">
                    <button
                        disabled
                        className={`px-4 py-2 ${ activeTab === "cart" ? "bg-gray-300" : "bg-gray-100" } rounded-t`}>
                        Cart
                    </button>
                    <button
                        disabled
                        className={`px-4 py-2 ${ activeTab === "checkout" ? "bg-gray-300" : "bg-gray-100" } rounded-t`}>
                        Checkout
                    </button>
                </div>
                <div className="border p-4 rounded-b">{renderTabContent()}</div>
            </div>
        </>
    );
}
