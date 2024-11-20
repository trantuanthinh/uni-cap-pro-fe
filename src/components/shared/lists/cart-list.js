import { decrementQuantity, incrementQuantity, setQuantity } from "@/redux/slicers/cartSlice";
import { addItemToCheckout } from "@/redux/slicers/checkoutSlice";
import sharedService from "@/services/sharedService";
import { Image } from "@nextui-org/react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import ConfirmDialog from "../default-confirm-dialog";

export default function CartList({ items = [], removeFromCheckout, removeFromCart }) {
    const dispatch = useDispatch();
    const [dialogId, setDialogId] = useState(null);
    const [selectedItems, setSelectedItems] = useState(new Set());

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
        dispatch(addItemToCheckout({ ...item, cart_type: "cart" }));
    };

    const handleSetQuantity = (item, quantity) => {
        const validQuantity = Math.max(1, quantity); // Prevent negative values
        dispatch(setQuantity({ id: item.id, quantity: validQuantity }));
        if (selectedItems.has(item.id)) {
            removeFromCheckout(item.id);
            addToCheckout({ ...item, totalItemQuantity: validQuantity });
        }
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
                                    <button
                                        color="danger"
                                        variant="bordered"
                                        size="sm"
                                        className="hover:text-danger-500"
                                        onClick={() => handleDecrement(product)}>
                                        <IoMdRemoveCircleOutline size={35} />
                                    </button>
                                    <input
                                        type="number"
                                        className="text-center text-xl w-10 rounded-lg"
                                        value={product.totalItemQuantity}
                                        onChange={(e) => handleSetQuantity(product, parseInt(e.target.value) || 0)}
                                    />
                                    <button
                                        color="success"
                                        variant="bordered"
                                        size="sm"
                                        className="hover:text-success-500"
                                        onClick={() => handleIncrement(product)}>
                                        <IoMdAddCircleOutline size={35} />
                                    </button>
                                    <button
                                        className="text-red-600 pl-5 hover:text-red-800"
                                        onClick={() => handleDialogOpen(product.id)}>
                                        <FaTrash size={20} />
                                    </button>
                                    <ConfirmDialog
                                        title={`Remove ${ product.name }?`}
                                        content="Are you sure you want to remove this item from your cart?"
                                        isOpen={isDialogOpen}
                                        onOpenChange={handleDialogClose}
                                        onSubmit={() => removeFromCart(product.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
