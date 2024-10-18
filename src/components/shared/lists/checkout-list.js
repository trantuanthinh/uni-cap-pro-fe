import sharedService from "@/services/sharedService";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import ConfirmDialog from "../default-confirm-dialog";

const { useState } = require("react");

export default function CheckoutList({ items = null, handleOrder }) {
    const [dialogIdInfo, setDialogIdInfo] = useState(null);

    function openDialog(itemId) {
        setDialogIdInfo(itemId);
    }

    function closeDialog() {
        setDialogIdInfo(null);
    }

    return (
        <>
            {items && items?.map((item, index) => {
                let product;
                switch (item?.cart_type) {
                    case "cart":
                        product = item;
                        break;
                    case "group-cart":
                        product = item?.product;
                        break;
                    default:
                        return;
                }
                const formattedPrice = sharedService.formatVietnamDong(product?.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(item?.totalItemQuantity * product?.price);

                const isDialogOpen = dialogIdInfo === product.id;

                return (
                    <div key={product.id} className="grid grid-cols-[100px_1fr_auto] items-center gap-4 border-b pb-4">
                        <div className="flex justify-center">
                            <div className="flex border-4 size-32 rounded-lg border-rich-brown mb-2">
                                <Image
                                    className="rounded-lg object-cover"
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={100}
                                    height={100}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="font-bold text-xl">{product.name}</p>
                            <span className="text-red-500">{formattedPrice}</span>
                            {item.isShare ? (
                                <p className="text-red-500">Shared Buy</p>
                            ) : (
                                <p className="text-red-500">Individual Buy</p>
                            )}
                            <div className="col-span-2">
                                <p className="text-lg font-semibold">Total Price: {formattedTotalPrice}</p>
                            </div>
                        </div>

                        <div className="grid grid-flow-row gap-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    className="hover:bg-danger-300"
                                    onClick={() => openDialog(product.id)}
                                    color="success"
                                    variant="flat">
                                    Buy
                                </Button>

                                <ConfirmDialog
                                    title={`Confirm Buy ${ product.name }`}
                                    content={`Are you sure you want to buy ${ product.name } from your checkout?`}
                                    isOpen={isDialogOpen}
                                    onOpenChange={closeDialog}
                                    onSubmit={() => handleOrder(item)}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
