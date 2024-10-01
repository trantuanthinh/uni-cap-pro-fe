import sharedService from "@/services/sharedService";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Dialog from "../default-dialog";

const { useState } = require("react");

export default function CheckoutList({ items = null, handleOrder }) {
    const [ dialogIdInfo, setDialogIdInfo ] = useState(null);

    function openDialog(itemId) {
        setDialogIdInfo(itemId);
    }

    function closeDialog() {
        setDialogIdInfo(null);
    }

    return (
        <>
            { items?.map((item, index) => {
                const formattedPrice = sharedService.formatVietnamDong(item?.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(item?.totalItemQuantity * item?.price);

                const isDialogOpen = dialogIdInfo === item.id;

                return (
                    <div key={ item.id } className="grid grid-cols-[100px_1fr_auto] items-center gap-4 border-b pb-4">
                        <div className="flex justify-center">
                            <div className="flex border-4 size-32 rounded-lg border-rich-brown mb-2">
                                <Image
                                    className="rounded-lg object-cover"
                                    src={ item.images[ 0 ] }
                                    alt={ item.name }
                                    width={ 100 }
                                    height={ 100 }
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="font-bold text-xl">{ item.name }</p>
                            <span className="text-red-500">{ formattedPrice }</span>
                            { item.isShare ? (
                                <p className="text-red-500">Shared Buy</p>
                            ) : (
                                <p className="text-red-500">Individual Buy</p>
                            ) }
                            <div className="col-span-2">
                                <p className="text-lg font-semibold">Total Price: { formattedTotalPrice }</p>
                            </div>
                        </div>

                        <div className="grid grid-flow-row gap-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    className="hover:bg-danger-300"
                                    onClick={ () => openDialog(item.id) }
                                    color="success"
                                    variant="flat">
                                    Buy
                                </Button>

                                <Dialog
                                    title={ `Confirm Buy ${ item.name }` }
                                    content={ `Are you sure you want to remove ${ item.name } from your cart?` }
                                    isOpen={ isDialogOpen }
                                    onOpenChange={ closeDialog }
                                    onSubmit={ () => handleOrder(item) }
                                />
                            </div>
                        </div>
                    </div>
                );
            }) }
        </>
    );
}
