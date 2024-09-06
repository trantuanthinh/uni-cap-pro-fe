import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { decrementQuantity, incrementQuantity, removeItemFromCart, resetCart } from "@/redux/slicers/cartSlice";
import sharedService from "@/services/sharedService";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const [haveProduct, setHaveProduct] = useState(false);

    const handleRemove = (id) => {
        dispatch(removeItemFromCart(id));
    };

    const handleIncrement = (id) => {
        dispatch(incrementQuantity(id));
    };

    const handleDecrement = (id) => {
        dispatch(decrementQuantity(id));
    };

    useEffect(() => {
        setHaveProduct(cart.items.length > 0);
        if (cart.items.length === 0) {
            dispatch(resetCart());
        }
    }, [cart.items, dispatch]);

    return (
        <>
            <Title label={ `${GlobalSettings.Settings.name} - Cart` } />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                <h3 className="text-2xl mb-6">Review the items in your cart and complete your purchase.</h3>
                { haveProduct ? (
                    <>
                        <CartList
                            items={ cart.items }
                            handleRemove={ handleRemove }
                            handleIncrement={ handleIncrement }
                            handleDecrement={ handleDecrement }
                        />
                        <CartTotal totalPrice={ cart.totalPrice } totalQuantity={ cart.totalQuantity } />
                    </>
                ) : (
                    <EmptyCartMessage />
                ) }
            </div>
        </>
    );
}

const CartList = ({ items, handleRemove, handleIncrement, handleDecrement }) => {
    const count = 1; //level
    return (
        <div className="space-y-6">
            { items.map((item) => {
                let formattedPrice = sharedService.formatVietnamDong(item.price);
                let formattedTotalPrice = sharedService.formatVietnamDong(item.price * count);
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
                            { count > 1 ? (
                                <>
                                    <span className="text-red-500">{ formattedPrice }</span>{ " " }
                                    <span className="line-through text-gray-700">{ formattedPrice }</span>
                                </>
                            ) : (
                                <span className="text-gray-700">{ formattedPrice }</span>
                            ) }
                            {/* <p className="text-sm text-gray-600">
                                <span className="font-semibold">Buy Together:</span> Available{ " " }
                                <span className="font-bold">{ count }/5</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Remaining:</span>{ " " }
                                <span className="font-bold">2d</span> left
                            </p> */}
                        </div>

                        <div className="grid grid-flow-row gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    className="flex items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-orange-200 transition-colors"
                                    onClick={ () => handleDecrement(item.id) }
                                >
                                    <IoMdRemoveCircleOutline size={ 24 } />
                                </button>
                                <p className="mx-4 text-xl font-bold">{ item.totalItemQuantity }</p>
                                <button
                                    className="flex items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-green-200 transition-colors"
                                    onClick={ () => handleIncrement(item.id) }
                                >
                                    <IoMdAddCircleOutline size={ 24 } />
                                </button>
                                <button
                                    className="flex items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-red-200 transition-colors"
                                    onClick={ () => handleRemove(item.id) }
                                >
                                    <FaTrash color="red" />
                                </button>
                            </div>
                            {/* <button
                                className="w-full flex items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-green-200 transition-colors"
                                onClick={ () => handleRemove(item.id) }
                            >
                                Buy Together
                            </button> */}
                        </div>
                    </div>
                );
            }) }
        </div>
    );
};

const CartTotal = ({ totalPrice, totalQuantity }) => {
    const formattedTotalPrice = sharedService.formatVietnamDong(totalPrice);

    return (
        <div className="flex justify-between items-center mt-6">
            <h2 className="text-2xl font-bold">Total Price: ${ formattedTotalPrice }</h2>
            <h3 className="text-xl">Total Quantity: { totalQuantity }</h3>
            <Link
                href="/cart/checkout"
                className="px-6 py-3 bg-primary-green text-white font-bold rounded hover:bg-green-600 transition-colors"
            >
                Proceed to Checkout
            </Link>
        </div>
    );
};

const EmptyCartMessage = () => (
    <div className="text-center">
        <p className="text-xl mb-4">Your cart is empty.</p>
        <Link
            href="/"
            className="px-6 py-3 bg-primary-green text-white font-bold rounded hover:bg-green-600 transition-colors"
        >
            Shop Now
        </Link>
    </div>
);
