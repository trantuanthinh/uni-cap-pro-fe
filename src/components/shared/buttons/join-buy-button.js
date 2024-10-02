import { addItemToGroupCart } from "@/redux/slicers/groupCartSlice";
import { Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function JoinedBuyButton({ item = null }) {
    const dispatch = useDispatch();

    function handleAddToGroupCart() {
        // dispatch(resetGroupCart());
        if (item) {
            dispatch(addItemToGroupCart(item));
        }
        toast.success("Added to Group Cart");
    }

    return (
        <Button onClick={ handleAddToGroupCart } className="text-lg" color="secondary" radius="small">
            Joined Buy Together
        </Button>
    );
}
