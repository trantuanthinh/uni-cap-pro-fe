import { DeliveryStatus } from "@/configurations/data-settings";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function JoinedBuyButton({ item = null }) {
    const router = useRouter();
    const user = useSelector((state) => state.user);

    function handleAddToGroupCart() {
        if (!user) {
            toast.error("Please login to join order");
            return;
        }

        item.sub_Orders.forEach((subOrder) => {
            if (subOrder.userId === user.id) {
                toast.error("Already Joined Order");
                return;
            }
        });

        if (item.delivery_Status !== DeliveryStatus.pending || !item.isActive) {
            toast.error("Order is not available to join");
            return;
        }

        if (item) {
            router.push(`/group-buy/${ item.id }`);
        }
        toast.success("You are available to join order");
    }

    return (
        <Button onClick={handleAddToGroupCart} className="text-lg" color="primary" radius="small">
            Join Buy Together
        </Button>
    );
}
