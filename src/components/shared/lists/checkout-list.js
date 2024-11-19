import sharedService from "@/services/sharedService";
import { Button, Image } from "@nextui-org/react";
import { useState } from "react";
import ConfirmDialog from "../default-confirm-dialog";

export default function CheckoutList({ items = [], handleOrder }) {
    const [dialogIdInfo, setDialogIdInfo] = useState(null);

    function openDialog(itemId) {
        setDialogIdInfo(itemId);
    }

    function closeDialog() {
        setDialogIdInfo(null);
    }

    return (
        <>
            {items && items?.map((item) => {
                const { cart_type, isShare, totalItemQuantity } = item;

                // Determine product and calculate discount price if applicable
                let product = cart_type === "cart" ? item : item?.product;
                if (!product) return null;

                let discountPrice = null;
                if (cart_type === "group-cart" && item.level > 1) {
                    const discountDetail = product?.discount?.discount_Details?.find(
                        (detail) => detail.level === item.level
                    );
                    if (discountDetail) {
                        discountPrice = sharedService.formatVietnamDong(
                            product.price - product.price * discountDetail.amount
                        );
                    }
                }

                const formattedPrice = sharedService.formatVietnamDong(product.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(totalItemQuantity * product.price);
                const isDialogOpen = dialogIdInfo === product.id;

                return (
                    <div key={product.id} className="grid grid-cols-[100px_1fr_auto] items-center gap-4 border-b pb-4">
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

                        {/* Product Details */}
                        <div className="space-y-1">
                            <p className="font-bold text-xl">{product.name}</p>
                            <span className="text-red-500">{formattedPrice}</span>
                            <div>
                                <p className="text-lg font-semibold">Total Price: {formattedTotalPrice}</p>
                                {discountPrice && <p className="text-lg font-semibold">Discount Price: {discountPrice}</p>}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid gap-3">
                            <p className="text-end text-sm text-red-500">{isShare ? "Shared Buy" : "Individual Buy"}</p>
                            <p className="text-end text-md text-red-500">Quantity: {totalItemQuantity}</p>
                            <Button
                                className="hover:bg-success-300"
                                onClick={() => openDialog(product.id)}
                                color="success"
                                variant="flat">
                                Buy
                            </Button>
                            <ConfirmDialog
                                title={`Confirm Purchase: ${ product.name }`}
                                content={`Are you sure you want to buy ${ product.name } from your checkout?`}
                                isOpen={isDialogOpen}
                                onOpenChange={closeDialog}
                                onSubmit={() => handleOrder(item)}
                            />
                        </div>
                    </div>
                );
            })}
        </>
    );
}
