import { addItemToCart } from "@/redux/slicers/cartSlice";
import { Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function AddToCartButton({ item = null }) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    function handleAddToCart() {
        if (!user) {
            toast.error("Please login to add to cart");
            return;
        }
        if (item) {
            dispatch(addItemToCart(item));
            toast.success("Added to Cart");
            return;
        }
        toast.error("Item not found");
    }

    return (
        <Button onClick={handleAddToCart} className="text-lg" color="primary" radius="small">
            Add to cart
        </Button>
    );
}
