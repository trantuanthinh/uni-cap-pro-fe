import { addItemToGroupCart } from "@/redux/slicers/groupCartSlice";
import { Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function AddToGroupCartButton({ item = null }) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    function handleAddToGroupCart() {
        if (!user) {
            toast.error("Please login to add to group cart");
            return;
        }

        if (item) {
            dispatch(addItemToGroupCart(item));
            toast.success("Added to Group Cart");
            return;
        }
        toast.error("Item not found");
    }

    return (
        <Button onClick={handleAddToGroupCart} className="text-lg" color="primary" radius="small">
            Add to Group Cart
        </Button>
    );
}
