import { DeliveryStatus } from "@/configurations/data-settings";
import clsx from "clsx"; // Import clsx for dynamic class names

export default function StatusLabel({ status }) {
    const statusMap = {
        [DeliveryStatus.pending]: { text: DeliveryStatus.pending, color: "yellow" },
        [DeliveryStatus.processing]: { text: DeliveryStatus.processing, color: "blue" },
        [DeliveryStatus.delivering]: { text: DeliveryStatus.delivering, color: "orange" },
        [DeliveryStatus.delivered]: { text: DeliveryStatus.delivered, color: "green" },
        [DeliveryStatus.cancelled]: { text: DeliveryStatus.cancelled, color: "red" },
    };

    const { text, color } = statusMap[status] || { text: "", color: "" };

    return (
        <div
            className={clsx(
                "px-2 py-1 rounded-lg text-sm font-medium",
                color ? `bg-${ color }-500` : "" // This ensures that the color class is only applied if 'color' is defined
            )}
        >
            {text}
        </div>
    );
}
