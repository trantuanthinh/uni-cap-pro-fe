import { Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";

export default function ShareBuyButton({ item }) {
    const dispatch = useDispatch();

    function handleAddToCheckoutCart() {
        dispatch(addSharedItemToCheckoutCart(item));
    }

    return (
        <Button onClick={ handleAddToCheckoutCart } className="text-lg" color="secondary" radius="small">
            Buy Together
        </Button>
    );
}
