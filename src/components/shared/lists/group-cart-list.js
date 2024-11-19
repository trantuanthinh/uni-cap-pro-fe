import { addItemToCheckout } from "@/redux/slicers/checkoutSlice";
import { decrementQuantity, incrementQuantity } from "@/redux/slicers/groupCartSlice";
import sharedService from "@/services/sharedService";
import { Image } from "@nextui-org/react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import ConfirmDialog from "../default-confirm-dialog";

export default function GroupCartList({ items = [], removeFromCheckout, removeFromGroupCart }) {
    const dispatch = useDispatch();
    const [dialogIdInfo, setDialogIdInfo] = useState(null);
    const [selected, setSelected] = useState([]);

    function openDialog(itemId) {
        setDialogIdInfo(itemId);
    }

    function closeDialog() {
        setDialogIdInfo(null);
    }

    function handleIncrement(item) {
        dispatch(incrementQuantity(item.id));
        if (selected.includes(item.id)) {
            removeFromCheckout(item.id);
            addToCheckout(item);
        }
    }

    function handleDecrement(item) {
        dispatch(decrementQuantity(item.id));
        if (selected.includes(item.id)) {
            removeFromCheckout(item.id);
            addToCheckout(item);
        }
    }

    function addToCheckout(item) {
        dispatch(
            addItemToCheckout({
                ...item,
                isShare: true,
                cart_type: "group-cart",
            })
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-lg font-semibold mb-4">Choose Your Joined Items</p>
            {items?.map((item) => {
                const product = item.product;
                if (!product) return null;

                let discountPrice;
                if (item.level > 1) {
                    for (let discount of product.discount.discount_Details) {
                        if (discount.level === item.level) {
                            discountPrice = sharedService.formatVietnamDong(product.price - product.price * discount.amount);
                            break;
                        }
                    }
                }

                const formattedPrice = sharedService.formatVietnamDong(product.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(item.totalItemQuantity * product.price);
                const formattedTotalOrderPrice = sharedService.formatVietnamDong(item.totalItemQuantity * item.total_Price);
                const isDialogOpen = dialogIdInfo === item.id;

                return (
                    <div key={item.id} className="grid grid-cols-[20px_100px_1fr_auto] items-center gap-4 border-b pb-4">
                        {/* Checkbox */}
                        <input
                            type="checkbox"
                            className="h-5 w-5 accent-blue-500"
                            checked={selected.includes(item.id)}
                            onChange={() => {
                                if (selected.includes(item.id)) {
                                    setSelected(selected.filter((itemId) => itemId !== item.id));
                                    removeFromCheckout(item.id);
                                } else {
                                    setSelected([...selected, item.id]);
                                    addToCheckout(item);
                                }
                            }}
                        />

                        {/* Product Image */}
                        <div className="flex justify-center">
                            <Image
                                className="rounded-lg object-cover"
                                src={product.images[0]}
                                alt={product.name}
                                width={100}
                                height={100}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-1">
                            <p className="font-bold text-xl">{product.name}</p>
                            <p className="text-red-500">{formattedPrice}</p>
                            {discountPrice && <p className="text-sm text-green-600">Discounted Price: {discountPrice}</p>}
                            <p className="text-lg font-semibold">Total Price: {formattedTotalPrice}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => handleDecrement(item)}>
                                    <IoMdRemoveCircleOutline size={24} />
                                </button>
                                <p className="w-12 text-center text-lg font-bold">
                                    {item.totalItemQuantity} {product.unitMeasure}
                                </p>
                                <button
                                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => handleIncrement(item)}>
                                    <IoMdAddCircleOutline size={24} />
                                </button>
                                <button
                                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => openDialog(item.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                            <ConfirmDialog
                                title={`Confirm Remove ${ product.name }`}
                                content={`Are you sure you want to remove ${ product.name } from your cart?`}
                                isOpen={isDialogOpen}
                                onOpenChange={closeDialog}
                                onSubmit={() => removeFromGroupCart(item.id)}
                            />
                            <p className="text-sm">Total Order Price: {formattedTotalOrderPrice}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
