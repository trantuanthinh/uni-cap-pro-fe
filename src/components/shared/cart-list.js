import { decrementQuantity, incrementQuantity } from "@/redux/slicers/cartSlice";
import { addItemToCheckout } from "@/redux/slicers/checkoutSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

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
        removeFromCheckout(item.id);
        dispatch(incrementQuantity(item.id));
        if (!selected.includes(item.id)) {
            setSelected([ ...selected, item.id ]); // Ensure the item is selected when quantity increases
        }
        addToCheckout(item);
    }

    function handleDecrement(item) {
        removeFromCheckout(item.id);
        dispatch(decrementQuantity(item.id));
        addToCheckout(item);
    }

    function addToCheckout(item) {
        let isShare = selectedTypes[ `${ item.id }` ] ?? false; // Default 'false' if not set
        dispatch(addItemToCheckout({ ...item, isShare })); // Add isShare to item when dispatching
    }

    function handleChangeType(value, item) {
        setSelectedTypes({ ...selectedTypes, [ item.id ]: value });
        if (selected.includes(item.id)) {
            removeFromCheckout(item.id);
            dispatch(addItemToCheckout({ ...item, isShare: true }));
        }
    }

    return (
        <CheckboxGroup label="Select Items" value={ selected } onValueChange={ setSelected }>
            { items?.map((item) => {
                const formattedPrice = sharedService.formatVietnamDong(item?.price);
                const formattedTotalPrice = sharedService.formatVietnamDong(item?.totalItemQuantity * item?.price);

                const isDialogOpen = dialogIdInfo === item.id;

                return (
                    <div key={ item.id } className="grid grid-cols-[20px_100px_1fr_auto] items-center gap-4 border-b pb-4">
                        <Checkbox
                            value={ item.id }
                            isSelected={ selected.includes(item.id) }
                            onChange={ () => {
                                if (selected.includes(item.id)) {
                                    setSelected(selected.filter((itemId) => itemId !== item.id)); // Uncheck
                                    removeFromCheckout(item.id);
                                } else {
                                    setSelected([ ...selected, item.id ]); // Check
                                    addToCheckout(item);
                                }
                            } }
                        />
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
                                    variant="flat">
                                    <FaTrash />
                                </Button>
                            </ButtonGroup>
                            <Dialog
                                title={ `Confirm Remove ${ item.name }` }
                                content={ `Are you sure you want to remove ${ item.name } from your cart?` }
                                isOpen={ isDialogOpen }
                                onOpenChange={ closeDialog }
                                onSubmit={ () => removeFromCart(item.id) }
                            />
                            <div className="flex justify-end">
                                <RadioGroup
                                    label="Buy Type"
                                    isRequired
                                    value={ selectedTypes[ item.id ] ?? false } // Set default value: false
                                    onValueChange={ (value) => handleChangeType(value, item) } // Update state
                                >
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
