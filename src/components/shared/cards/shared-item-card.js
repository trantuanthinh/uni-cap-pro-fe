import sharedService from "@/services/sharedService";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import JoinedBuyButton from "../buttons/join-buy-button";
import StatusLabel from "../status-label";

export default function SharedItemCard({ order }) {
    const store = order?.store || {};
    const formattedTotalPrice = sharedService.formatVietnamDong(order?.total_Price || 0);
    const timeLeft = sharedService.formatToTime(order?.timeLeft);
    const deliveryStatus = order?.delivery_Status;

    return (
        <div className="flex flex-col p-5 bg-white shadow-xl rounded-lg transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl hover:cursor-pointer">
            {/* Image of the seller */}
            <Link href={`/stores/detail/${ store.id || "#" }`} passHref>
                <div className="relative flex flex-col justify-center items-center aspect-[4/3] space-y-2">
                    <div className="font-semibold text-xl text-gray-800">Store: {store?.name || "Unknown Store"}</div>
                    <Image
                        className="rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                        src={store.avatar || "/demoImage.jpg"}
                        alt={store.name || "Store Avatar"}
                        layout="fill"
                    />
                </div>
            </Link>

            {/* Store Info and Status */}
            <div className="flex flex-row items-center justify-between space-y-3 mb-2">
                <div className="text-md text-gray-700">
                    <span className="font-medium text-red-500">Ends in:</span> <span>{timeLeft}</span>
                </div>
                <StatusLabel status={deliveryStatus} />
            </div>

            {/* Price and Join Button */}
            <div className="flex flex-col items-center mt-auto">
                <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    Total Price: <span className="text-primary font-bold">{formattedTotalPrice}</span>
                </div>
                <JoinedBuyButton item={order} />
            </div>
        </div>
    );
}
