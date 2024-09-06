import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import sharedService from "@/services/sharedService";
import Image from "next/image";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";

export default function Checkout() {
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);

    function submitOrder() {
        console.log("submit order");
    }
    return (
        <>
            <Title label={ `${GlobalSettings.Settings.name} - Checkout` } />
            <div className="container max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>

                { cart.items.map((item) => {
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

                            <div className="flex-1">
                                <h2 className="text-xl font-semibold">{ item.name }</h2>
                                <p>Price: { formattedPrice } / unit</p>
                                <p>Quantity: { item.totalItemQuantity }</p>
                            </div>

                            <div className="text-xl font-bold">{ formattedTotalPrice }</div>
                        </div>
                    );
                }) }

                <p className="mt-6 text-right text-2xl font-bold">
                    Total: { sharedService.formatVietnamDong(cart.totalPrice) }
                </p>

                <button
                    onClick={ submitOrder }
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition mt-8 text-right"
                >
                    Order
                </button>
            </div>
        </>
    );
}
