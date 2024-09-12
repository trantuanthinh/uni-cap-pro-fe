"use client";

import Dialog from "@/components/shared/default-dialog";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { decrementQuantity, incrementQuantity, removeItemFromCart, resetCart } from "@/redux/slicers/cartSlice";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import { Button, ButtonGroup, Card, CardBody, Link, Tab, Tabs } from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const user = useSelector((state) => state.user);
    const [haveProduct, setHaveProduct] = useState(false);

    function handleRemove(id) {
        dispatch(removeItemFromCart(id));
    }

    function handleIncrement(id) {
        dispatch(incrementQuantity(id));
    }

    function handleDecrement(id) {
        dispatch(decrementQuantity(id));
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
                handleRemove(item.id);
            }
        } catch (error) {
            console.log("Error: ", error.message);
        }
        // dispatch(decrementQuantity(id));
    }

    useEffect(() => {
        setHaveProduct(cart.items.length > 0);
        if (cart.items.length === 0) {
            dispatch(resetCart());
        }
    }, [cart.items, dispatch]);

    return (
        <>
            <Title label={ `${GlobalSettings.Settings.name} - Cart` } />
            <div className="h-full container mx-auto py-8">
                <div>
                    <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                </div>
                <div>
                    <h3 className="text-2xl mb-6">Review the items in your cart and complete your purchase.</h3>
                </div>
                { haveProduct ? (
                    <>
                        <CartList
                            items={ cart.items }
                            handleRemove={ handleRemove }
                            handleIncrement={ handleIncrement }
                            handleDecrement={ handleDecrement }
                            handleOrder={ handleOrder }
                        />
                    </>
                ) : (
                    <EmptyCartMessage />
                ) }
            </div>
        </>
    );
}

const EmptyCartMessage = () => (
    <div className="flex items-end justify-center text-center">
        <div>
            <p className="text-xl mb-4">Your cart is empty.</p>
            <Button as={ Link } href="/" className="text-lg font-bold transition-colors" color="success" radius="lg">
                Shop Now
            </Button>
        </div>
    </div>
);

const CartList = ({ items, handleRemove, handleIncrement, handleDecrement, handleOrder }) => {
    const count = 1; //level
    const tabs = [
        {
            id: "cart_items",
            label: "Cart Items",
            content: (
                <ItemList
                    items={ items }
                    handleRemove={ handleRemove }
                    handleIncrement={ handleIncrement }
                    handleDecrement={ handleDecrement }
                    handleBuy={ handleOrder }
                />
            ),
        },
        {
            id: "checkout_items",
            label: "Checkout Items",
            content: <ItemList />,
        },
    ];
    return (
        <Tabs aria-label="Item Tabs" items={ tabs }>
            { (item) => (
                <Tab key={ item.id } title={ item.label }>
                    <Card className="px-2">
                        <CardBody className="space-y-2">{ item.content }</CardBody>
                    </Card>
                </Tab>
            ) }
        </Tabs>
    );
};

const ItemList = ({ items, handleRemove, handleIncrement, handleDecrement, handleOrder }) => {
    const [dialogInfo, setDialogInfo] = useState({ itemId: null, action: "" });

    const openDialog = (itemId, action) => {
        setDialogInfo({ itemId, action });
    };

    const closeDialog = () => {
        setDialogInfo({ itemId: null, action: "" });
    };

    return (
        <>
            { Array.isArray(items) &&
                items?.map((item, index) => {
                    const formattedPrice = sharedService.formatVietnamDong(item?.price);
                    const formattedTotalPrice = sharedService.formatVietnamDong(
                        item?.totalItemQuantity * item?.price
                    );

                    const isDialogOpen = dialogInfo.itemId === item.id;

                    return (
                        <div
                            key={ `${item.id}-${index}` }
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
                                    <ButtonGroup>
                                        <Button
                                            className="hover:bg-success-500"
                                            onClick={ () => handleDecrement(item.id) }
                                        >
                                            <IoMdRemoveCircleOutline size={ 24 } />
                                        </Button>
                                        <div className="w-12 flex justify-center">
                                            <p className="mx-4 text-xl font-bold">{ item.totalItemQuantity }</p>
                                        </div>
                                        <Button
                                            className="hover:bg-success-500"
                                            onClick={ () => handleIncrement(item.id) }
                                        >
                                            <IoMdAddCircleOutline size={ 24 } />
                                        </Button>
                                        <Button
                                            className="hover:bg-danger-300"
                                            onClick={ () => openDialog(item.id, "remove") }
                                            color="danger"
                                            variant="flat"
                                        >
                                            <FaTrash />
                                        </Button>
                                        { dialogInfo.action === "remove" && isDialogOpen && (
                                            <Dialog
                                                title={ `Confirm Remove ${item.name}` }
                                                content={ `Are you sure you want to remove ${item.name} from your cart?` }
                                                isOpen={ isDialogOpen }
                                                onOpenChange={ closeDialog }
                                                onSubmit={ () => handleRemove(item.id) }
                                            />
                                        ) }
                                    </ButtonGroup>
                                </div>

                                <div className="grid grid-cols-2 grid-rows-1">
                                    <div className="row-start-2 px-2">
                                        <Button
                                            className="w-full flex items-center justify-center p-2 rounded-md bg-gray-100  transition-colors hover:bg-success-500"
                                            onClick={ () => openDialog(item.id, "share") }
                                        >
                                            Share Buy
                                        </Button>
                                        { dialogInfo.action === "share" && isDialogOpen && (
                                            <Dialog
                                                title={ `Confirm Share Buy ${item.name}` }
                                                content={ `Are you sure you want to share buy ${item.name}?` }
                                                isOpen={ isDialogOpen }
                                                onOpenChange={ closeDialog }
                                                onSubmit={ () => handleOrder(item, true) }
                                            />
                                        ) }
                                    </div>
                                    <div className="row-start-2 px-2">
                                        <Button
                                            className="w-full flex items-center justify-center p-2 rounded-md bg-gray-100 transition-colors hover:bg-success-500"
                                            onClick={ () => openDialog(item.id, "buy") }
                                        >
                                            Buy
                                        </Button>
                                        { dialogInfo.action === "buy" && isDialogOpen && (
                                            <Dialog
                                                title={ `Confirm Buy ${item.name}` }
                                                content={ `Are you sure you want to buy ${item.name}?` }
                                                isOpen={ isDialogOpen }
                                                onOpenChange={ closeDialog }
                                                onSubmit={ () => handleOrder(item, false) }
                                            />
                                        ) }
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) }
        </>
    );
};
