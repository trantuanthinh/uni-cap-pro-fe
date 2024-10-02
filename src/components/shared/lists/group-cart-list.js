import { addItemToCheckout } from "@/redux/slicers/checkoutSlice";
import { decrementQuantity, incrementQuantity } from "@/redux/slicers/groupCartSlice";
import sharedService from "@/services/sharedService";
import { Button, ButtonGroup, Checkbox, CheckboxGroup } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import Dialog from "../default-dialog";

export default function GroupCartList({ items = [], removeFromCheckout, removeFromGroupCart }) {
    const dispatch = useDispatch();
    const [ dialogIdInfo, setDialogIdInfo ] = useState(null);
    const [ selected, setSelected ] = useState([]);

    const openDialog = (itemId) => setDialogIdInfo(itemId);
    const closeDialog = () => setDialogIdInfo(null);

    const handleIncrement = (item) => {
        removeFromCheckout(item.id);
        dispatch(incrementQuantity(item.id));
        if (!selected.includes(item.id)) {
            setSelected((prev) => [ ...prev, item.id ]); // Ensure the item is selected when quantity increases
        }
        addToCheckout(item);
    };

    const handleDecrement = (item) => {
        removeFromCheckout(item.id);
        dispatch(decrementQuantity(item.id));
        addToCheckout(item);
    };

    const addToCheckout = (item) => {
        dispatch(addItemToCheckout({ ...item, isShare: true })); // Add isShare to item when dispatching
    };

    return (
        <CheckboxGroup label="Select Items" value={ selected } onValueChange={ setSelected }>
            { items.map((item) => {
                const product = item.product;

                if (!product) return null;

                const formattedPrice = sharedService.formatVietnamDong(product.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(product.totalItemQuantity * product.price);
                const isDialogOpen = dialogIdInfo === item.id;

                return (
                    <div key={ item.id } className="grid grid-cols-[20px_100px_1fr_auto] items-center gap-4 border-b pb-4">
                        <Checkbox
                            value={ item.id }
                            isSelected={ selected.includes(item.id) }
                            onChange={ () => {
                                const newSelected = selected.includes(item.id)
                                    ? selected.filter((itemId) => itemId !== item.id) // Uncheck
                                    : [ ...selected, item.id ]; // Check

                                setSelected(newSelected);
                                if (newSelected.includes(item.id)) {
                                    addToCheckout(item);
                                } else {
                                    removeFromCheckout(item.id);
                                }
                            } }
                        />
                        <div className="flex justify-center">
                            <div className="flex border-4 size-32 rounded-lg border-rich-brown mb-2">
                                <Image
                                    className="rounded-lg object-cover"
                                    src={ product.images[ 0 ] }
                                    alt={ product.name }
                                    width={ 100 }
                                    height={ 100 }
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="font-bold text-xl">{ product.name }</p>
                            <span className="text-red-500">{ formattedPrice }</span>
                            <div className="col-span-2">
                                <p className="text-lg font-semibold">Total Price: { formattedTotalPrice }</p>
                            </div>
                        </div>

                        <div className="grid grid-flow-row gap-3">
                            <ButtonGroup>
                                <Button className="hover:bg-success-500" onClick={ () => handleDecrement(item) }>
                                    <IoMdRemoveCircleOutline size={ 24 } />
                                </Button>
                                <div className="w-12 flex justify-center">
                                    <p className="mx-4 text-xl font-bold">{ item.totalItemQuantity }</p>
                                </div>
                                <Button className="hover:bg-success-500" onClick={ () => handleIncrement(item) }>
                                    <IoMdAddCircleOutline size={ 24 } />
                                </Button>
                                <Button
                                    className="hover:bg-danger-300"
                                    onClick={ () => openDialog(item.id) }
                                    color="danger"
                                    variant="flat"
                                >
                                    <FaTrash />
                                </Button>
                            </ButtonGroup>
                            <Dialog
                                title={ `Confirm Remove ${ product.name }` }
                                content={ `Are you sure you want to remove ${ product.name } from your cart?` }
                                isOpen={ isDialogOpen } // This should reflect the state
                                onOpenChange={ closeDialog }
                                onSubmit={ () => removeFromGroupCart(item.id) }
                            />
                        </div>
                    </div>
                );
            }) }
        </CheckboxGroup>
    );
}
