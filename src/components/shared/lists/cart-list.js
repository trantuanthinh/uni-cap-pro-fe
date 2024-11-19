import { decrementQuantity, incrementQuantity } from "@/redux/slicers/cartSlice";
import { addItemToCheckout } from "@/redux/slicers/checkoutSlice";
import sharedService from "@/services/sharedService";
import { Button, Image } from "@nextui-org/react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import ConfirmDialog from "../default-confirm-dialog";

export default function CartList({ items = [], removeFromCheckout, removeFromCart }) {
    const dispatch = useDispatch();
    const [dialogId, setDialogId] = useState(null);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectedTypes, setSelectedTypes] = useState({}); // Tracks buy type for each item

    const handleDialogOpen = (id) => setDialogId(id);
    const handleDialogClose = () => setDialogId(null);

    const toggleSelection = (item) => {
        const updatedSelection = new Set(selectedItems);
        if (updatedSelection.has(item.id)) {
            updatedSelection.delete(item.id);
            removeFromCheckout(item.id);
        } else {
            updatedSelection.add(item.id);
            addToCheckout(item);
        }
        setSelectedItems(updatedSelection);
    };

    const addToCheckout = (item) => {
        const isShare = selectedTypes[item.id] || false;
        dispatch(addItemToCheckout({ ...item, isShare, cart_type: "cart" }));
    };

    const handleIncrement = (item) => {
        dispatch(incrementQuantity(item.id));
        if (selectedItems.has(item.id)) {
            removeFromCheckout(item.id);
            addToCheckout(item);
        }
    };

    const handleDecrement = (item) => {
        dispatch(decrementQuantity(item.id));
        if (selectedItems.has(item.id)) {
            removeFromCheckout(item.id);
            addToCheckout(item);
        }
    };

    const handleTypeChange = (type, item) => {
        setSelectedTypes((prev) => ({ ...prev, [item.id]: type }));
        if (selectedItems.has(item.id)) {
            removeFromCheckout(item.id);
            dispatch(addItemToCheckout({ ...item, isShare: type, cart_type: "cart" }));
        }
    };

    return (
        <div className="space-y-4">
            {items.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is currently empty.</p>
            ) : (
                items.map((product) => {
                    const formattedPrice = sharedService.formatVietnamDong(product.price);
                    const formattedTotalPrice = sharedService.formatVietnamDong(product.totalItemQuantity * product.price);
                    const isDialogOpen = dialogId === product.id;

                    return (
                        <div key={product.id} className="flex items-center gap-4 border-b pb-4">
                            <input
                                type="checkbox"
                                className="w-5 h-5"
                                checked={selectedItems.has(product.id)}
                                onChange={() => toggleSelection(product)}
                            />
                            <div className="flex items-center">
                                <Image
                                    className="rounded-lg object-cover border"
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-lg font-bold">{product.name}</p>
                                <p className="text-red-500">{formattedPrice}</p>
                                <p className="text-sm text-gray-600">Total: {formattedTotalPrice}</p>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-row justify-end pr-3 items-center gap-3">
                                    <Button
                                        color="danger"
                                        variant="bordered"
                                        size="sm"
                                        className="hover:bg-danger-100"
                                        onClick={() => handleDecrement(product)}>
                                        <IoMdRemoveCircleOutline size={24} />
                                    </Button>
                                    <p className="mx-4 text-xl font-bold">{product.totalItemQuantity}</p>
                                    <Button
                                        color="success"
                                        variant="bordered"
                                        size="sm"
                                        className="hover:bg-success-100"
                                        onClick={() => handleIncrement(product)}>
                                        <IoMdAddCircleOutline size={24} />
                                    </Button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDialogOpen(product.id)}>
                                        <FaTrash />
                                    </button>
                                    <ConfirmDialog
                                        title={`Remove ${ product.name }?`}
                                        content="Are you sure you want to remove this item from your cart?"
                                        isOpen={isDialogOpen}
                                        onOpenChange={handleDialogClose}
                                        onSubmit={() => removeFromCart(product.id)}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`type-${ product.id }`}
                                            value="false"
                                            checked={selectedTypes[product.id] === false}
                                            onChange={() => handleTypeChange(false, product)}
                                        />
                                        Individual Buy
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`type-${ product.id }`}
                                            value="true"
                                            checked={selectedTypes[product.id] === true}
                                            onChange={() => handleTypeChange(true, product)}
                                        />
                                        Shared Buy
                                    </label>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
