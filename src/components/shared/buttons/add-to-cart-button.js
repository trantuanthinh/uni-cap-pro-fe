import { addItemToCart } from "@/redux/slicers/cartSlice";
import { Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function AddToCartButton({ item = null }) {
    const dispatch = useDispatch();

    function handleAddToCart() {
        if (item) {
            dispatch(addItemToCart(item));
        }
        toast.success("Added to Cart");
    }

    return (
        <Button onClick={ handleAddToCart } className="text-lg" color="primary" radius="small">
            Add to cart
        </Button>
    );
}
