import { QuantityRange } from "@/configurations/data-settings";
import { decrementQuantity, incrementQuantity, setQuantity } from "@/redux/slicers/groupCartSlice";
import sharedService from "@/services/sharedService";
import { Image } from "@nextui-org/react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import ConfirmDialog from "../default-confirm-dialog";

export default function GroupCartList({ items = [], removeFromGroupCart }) {
    const dispatch = useDispatch();
    const [dialogIdInfo, setDialogIdInfo] = useState(null);

    function openDialog(itemId) {
        setDialogIdInfo(itemId);
    }

    function closeDialog() {
        setDialogIdInfo(null);
    }

    function handleIncrement(item) {
        dispatch(incrementQuantity(item.id));
    }

    function handleDecrement(item) {
        dispatch(decrementQuantity(item.id));
    }

    const handleSetQuantity = (item, quantity) => {
        const validQuantity = Math.max(1, Number(quantity) || 1);
        dispatch(setQuantity({ id: item.id, quantity: validQuantity }));
    };

    return (
        <div className="space-y-4 mt-4">
            {/* <p className="text-sm">Total Order Price: {formattedTotalOrderPrice}</p> */}
            {items?.map((product) => {
                if (!product) return null;

                let discountPrice;
                if (product.level > 1) {
                    for (let discount of product.discount.discount_Details) {
                        if (discount.level === product.level) {
                            discountPrice = sharedService.formatVietnamDong(product.price - product.price * discount.amount);
                            break;
                        }
                    }
                }

                const formattedPrice = sharedService.formatVietnamDong(product.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(product.totalItemQuantity * product.price);
                const formattedTotalOrderPrice = sharedService.formatVietnamDong(product.totalItemQuantity * product.total_Price);
                const isDialogOpen = dialogIdInfo === product.id;

                return (
                    <div key={product.id} className="grid grid-cols-1 grid-rows-2 items-center border-b">
                        <div className="flex flex-row space-x-3">
                            {/* Product Image */}
                            <div className="flex justify-center">
                                <Image
                                    className="rounded-lg object-cover"
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={80}
                                    height={80}
                                />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1">
                                <p className="font-bold text-lg">{product.name}</p>
                                <p className="text-red-500 text-sm">{formattedPrice}</p>
                                {discountPrice && <p className="text-sm text-green-600">Discounted Price: {discountPrice}</p>}
                                <p className="text-md font-semibold">Total Price: {formattedTotalPrice}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row justify-center items-center gap-3">
                            <button
                                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => handleDecrement(product)}>
                                <IoMdRemoveCircleOutline size={24} />
                            </button>
                            <input
                                type="number"
                                className="text-center text-xl w-14 rounded-lg"
                                value={product.totalItemQuantity}
                                min={QuantityRange.min}
                                max={QuantityRange.max}
                                onChange={(e) => {
                                    const value = Math.min(
                                        QuantityRange.max,
                                        Math.max(1, parseInt(e.target.value, 10) || QuantityRange.min)
                                    );
                                    handleSetQuantity(product, value);
                                }}
                                aria-label={`Set quantity for ${ product.name }`}
                            />
                            <button
                                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => handleIncrement(product)}>
                                <IoMdAddCircleOutline size={24} />
                            </button>
                            <button
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => openDialog(product.id)}>
                                <FaTrash />
                            </button>
                        </div>
                        <ConfirmDialog
                            title={`Confirm Remove ${ product.name }`}
                            content={`Are you sure you want to remove ${ product.name } from your cart?`}
                            isOpen={isDialogOpen}
                            onOpenChange={closeDialog}
                            onSubmit={() => removeFromGroupCart(product.id)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
