import { decrementQuantity, incrementQuantity } from "@/redux/slicers/cartSlice";
import { addItemToCheckout } from "@/redux/slicers/checkoutSlice";
import sharedService from "@/services/sharedService";
import { Button, ButtonGroup, Checkbox, CheckboxGroup, Radio, RadioGroup } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import ConfirmDialog from "../default-confirm-dialog";

export default function CartList({ items = null, removeFromCheckout, removeFromCart }) {
    const dispatch = useDispatch();
    const [ dialogIdInfo, setDialogIdInfo ] = useState(null);
    const [ selected, setSelected ] = useState([]);
    const [ selectedTypes, setSelectedTypes ] = useState({}); // Track selected type for each item

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
        const isShare = selectedTypes[ item.id ] ?? false; // Default 'false' if not set
        dispatch(addItemToCheckout({ ...item, isShare: isShare, cart_type: "cart" })); // Add isShare to item when dispatching
    }

    function handleChangeType(value, item) {
        setSelectedTypes({ ...selectedTypes, [ item.id ]: value });
        if (selected.includes(item.id)) {
            removeFromCheckout(item.id);
            dispatch(addItemToCheckout({ ...item, isShare: true, cart_type: "cart" }));
        }
    }

    return (
        <CheckboxGroup label="Choose Your Items and Types" value={ selected } onValueChange={ setSelected }>
            { items?.map((product) => {
                const formattedPrice = sharedService.formatVietnamDong(product?.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(product?.totalItemQuantity * product?.price);

                const isDialogOpen = dialogIdInfo === product.id;

                return (
                    <div key={ product.id } className="grid grid-cols-[20px_100px_1fr_auto] items-center gap-4 border-b pb-4">
                        <Checkbox
                            value={ product.id }
                            isSelected={ selected.includes(product.id) }
                            onChange={ () => {
                                if (selected.includes(product.id)) {
                                    setSelected(selected.filter((itemId) => itemId !== product.id)); // Uncheck
                                    removeFromCheckout(product.id);
                                } else {
                                    setSelected([ ...selected, product.id ]); // Check
                                    addToCheckout(product);
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
                                <Button className="hover:bg-success-500" onClick={ () => handleDecrement(product) }>
                                    <IoMdRemoveCircleOutline size={ 24 } />
                                </Button>
                                <div className="w-12 flex justify-center">
                                    <p className="mx-4 text-xl font-bold">{ product.totalItemQuantity }</p>
                                </div>
                                <Button className="hover:bg-success-500" onClick={ () => handleIncrement(product) }>
                                    <IoMdAddCircleOutline size={ 24 } />
                                </Button>
                                <Button
                                    className="hover:bg-danger-300"
                                    onClick={ () => openDialog(product.id) }
                                    color="danger"
                                    variant="flat">
                                    <FaTrash />
                                </Button>
                            </ButtonGroup>
                            <ConfirmDialog
                                title={ `Confirm Remove ${ product.name }` }
                                content={ `Are you sure you want to remove ${ product.name } from your cart?` }
                                isOpen={ isDialogOpen }
                                onOpenChange={ closeDialog }
                                onSubmit={ () => removeFromCart(product.id) }
                            />
                            <div className="flex justify-end">
                                <RadioGroup
                                    label="Buy Type"
                                    isRequired
                                    orientation="horizontal"
                                    value={ selectedTypes[ product.id ] ?? false } // Set default value: false
                                    onValueChange={ (value) => handleChangeType(value, product) } // Update state
                                >
                                    <Radio default value={ false }>
                                        Individual Buy
                                    </Radio>
                                    <Radio value={ true }>Shared Buy</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                );
            }) }
        </CheckboxGroup>
    );
}
