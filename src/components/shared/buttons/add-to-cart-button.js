import { addToCart } from "@/redux/slicers/cartSlice";
import { Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";

export default function AddToCartButton({ item = null }) {
    const dispatch = useDispatch();

    function handleAddToCart() {
        dispatch(addToCart(item));
    }

    return (
        <Button onClick={ handleAddToCart } className="text-lg" color="primary" radius="small">
            Add to cart
        </Button>
    );
}
