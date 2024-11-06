import { addItemToGroupCart } from "@/redux/slicers/groupCartSlice";
import { Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function JoinedBuyButton({ item = null }) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    function handleAddToGroupCart() {
        if (!user) {
            toast.error("Please login to add to cart");
            return;
        }
        item.sub_Orders.forEach((subOrder) => {
            if (subOrder.userId === user.id) {
                toast.error("Already Joined Order");
                return;
            }
        });
        if (item) {
            dispatch(addItemToGroupCart(item));
        }
        toast.success("Added to Group Cart");
    }

    return (
        <Button onClick={handleAddToGroupCart} className="text-lg" color="secondary" radius="small">
            Joined Buy Together
        </Button>
    );
}
