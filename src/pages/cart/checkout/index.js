import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sharedService from "@/services/sharedService";
import Image from "next/image";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";

export default function Checkout() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const [haveProduct, setHaveProduct] = useState(false);

    useEffect(() => {
        setHaveProduct(cart.items.length > 0);
        if (cart.items.length === 0) {
            dispatch(resetCart());
        }
    }, [cart.items, dispatch]);

    function submitOrder() {
        // const dataJson = {
        //     productId:
        // };
    }

    function shareOrder() {
        console.log("shareOrder");
    }
    return (
        <>
            <Title label={ `${GlobalSettings.Settings.name} - Checkout` } />
            <div className="container max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                { haveProduct && (
                    <>
                        <CartList items={ cart.items } />
                        <CartTotal
                            totalPrice={ cart.totalPrice }
                            totalQuantity={ cart.totalQuantity }
                            submitOrder={ submitOrder }
                            shareOrder={ shareOrder }
                        />
                    </>
                ) }
            </div>
        </>
    );
}

const CartList = ({ items }) => {
    return (
        <div className="space-y-6">
            { items.map((item) => {
                let formattedPrice = sharedService.formatVietnamDong(item.price);
                let formattedTotalPrice = sharedService.formatVietnamDong(item.price * item.totalItemQuantity);
                return (
                    <div
                        key={ item.id }
                        className="grid grid-cols-[100px_1fr_auto] items-center gap-4 border-b pb-4"
                    >
                        <div className="flex justify-center">
                            <div className="flex border-4 size-32 rounded-lg border-rich-brown mb-2">
                                <Image
                                    className="rounded-lg object-cover"
                                    src={ item.images[0] }
                                    alt={ item.name }
                                    width={ 100 }
                                    height={ 100 }
                                    objectFit="cover"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">{ item.name }</h3>
                            <span className="text-gray-700">{ formattedPrice }</span>
                        </div>

                        <div>
                            <h3>{ formattedTotalPrice }</h3>
                        </div>
                    </div>
                );
            }) }
        </div>
    );
};

const CartTotal = ({ totalPrice, totalQuantity, submitOrder, shareOrder }) => {
    const formattedTotalPrice = sharedService.formatVietnamDong(totalPrice);

    return (
        <div className="flex flex-col justify-between items-end mt-6">
            <h2 className="text-2xl font-bold">Total Price: ${ formattedTotalPrice }</h2>
            <h3 className="text-xl">Total Quantity: { totalQuantity }</h3>
            <div className="flex flex-row space-x-5">
                <button
                    onClick={ submitOrder }
                    className="px-6 py-3 bg-primary-green text-white font-bold rounded hover:bg-green-600 transition-colors"
                >
                    Order
                </button>
                <button
                    onClick={ shareOrder }
                    className="px-6 py-3 bg-primary-green text-white font-bold rounded hover:bg-green-600 transition-colors"
                >
                    Share Order
                </button>
            </div>
        </div>
    );
};
