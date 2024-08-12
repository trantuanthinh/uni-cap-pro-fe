import { useSelector, useDispatch } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { removeItemFromCart, resetCart, incrementQuantity, decrementQuantity } from "@/redux/slicers/cartSlice";
import { useEffect, useState } from "react";
import sharedService from "@/services/sharedService";
import Head from "next/head";
import { IoMdRemoveCircleOutline, IoMdAddCircleOutline } from "react-icons/io";

const CartTable = ({ items, handleRemove, handleIncrement, handleDecrement }) => (
    <table className="min-w-full bg-white border text-2xl border-gray-200 rounded-lg shadow-md">
        <thead>
            <tr className="bg-gray-100 text-center">
                <th className="py-3 px-4 border-b">Product Name</th>
                <th className="py-3 px-4 border-b">Unit Price</th>
                <th className="py-3 px-4 border-b">Quantity</th>
                <th className="py-3 px-4 border-b">Total</th>
                <th className="py-3 px-4 border-b">Actions</th>
            </tr>
        </thead>
        <tbody>
            { items.map((item) => {
                const formattedPrice = sharedService.formatVietnamDong(item.price);
                const formattedTotalItemPrice = sharedService.formatVietnamDong(item.totalItemPrice);
                return (
                    <tr key={ item.id } className="border-r text-xl">
                        <td className="py-2 px-4">{ item.name }</td>
                        <td className="py-2 px-4">${ formattedPrice }</td>
                        <td className="py-2 px-4 flex flex-row justify-center items-center">
                            <IoMdRemoveCircleOutline
                                size={ 24 }
                                className="cursor-pointer"
                                onClick={ () => handleDecrement(item.id) }
                            />
                            <p className="mx-10 max-w-3">{ item.totalItemQuantity }</p>
                            <IoMdAddCircleOutline
                                size={ 24 }
                                className="cursor-pointer"
                                onClick={ () => handleIncrement(item.id) }
                            />
                        </td>
                        <td className="py-2 px-4 max-w-10">${ formattedTotalItemPrice }</td>
                        <td className="py-2 px-4 flex flex-row justify-end">
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={ () => handleRemove(item.id) }
                            >
                                <FaTrashAlt size={ 24 } />
                            </button>
                        </td>
                    </tr>
                );
            }) }
        </tbody>
    </table>
);

const CartTotal = ({ totalPrice, totalQuantity }) => {
    const formattedTotalPrice = sharedService.formatVietnamDong(totalPrice);

    return (
        <div className="flex justify-between items-center mt-6">
            <h2 className="text-2xl font-bold">Total Price: ${ formattedTotalPrice }</h2>
            <h3 className="text-xl">Total Quantity: { totalQuantity }</h3>
            <Link
                href="/checkout"
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
            href="/products"
            className="px-6 py-3 bg-primary-green text-white font-bold rounded hover:bg-green-600 transition-colors"
        >
            Shop Now
        </Link>
    </div>
);

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
            <Head>
                <title>Cart</title>
                <meta
                    name="description"
                    content="Review and manage the items in your shopping cart. Update quantities, remove items, and proceed to checkout for a seamless shopping experience."
                />
            </Head>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                { haveProduct ? (
                    <>
                        <CartTable
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
