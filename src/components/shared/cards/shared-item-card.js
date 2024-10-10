import sharedService from "@/services/sharedService";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import JoinedBuyButton from "../buttons/join-buy-button";

export default function SharedItemCard({ order }) {
    const product = order.product;
    const starRating = product.total_Rating_Quantity === 0 ? 0 : product.total_Rating_Value / product.total_Rating_Quantity;
    const formattedPrice = sharedService.formatVietnamDong(product.price);

    let discountPrice;
    if (order.level > 1) {
        for (let item of product.discount.discount_Details) {
            if (item.level == order.level) {
                discountPrice = sharedService.formatVietnamDong(product.price - product.price * item.amount);
                break;
            }
        }
    }

    return (
        <div className="grid grid-flow-row grid-rows-1 overflow-hidden shadow-xl p-4 m-5 bg-white transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100">
            <Link href={ `/products/detail/${ product.id }` }>
                <div className="flex justify-center">
                    <div className="flex border-4 size-52 rounded-lg border-rich-brown mb-2">
                        <Image
                            className="rounded object-cover"
                            src={ product.images[ 0 ] }
                            alt={ product.name }
                            width={ 240 }
                            height={ 240 }
                        />
                    </div>
                </div>

                <div className="grid grid-flow-row py-4">
                    <div className="flex opacity-50">
                        <span className="mr-1">{ starRating.toFixed(1) }</span>
                        <FaStar color="gold" size={ 24 } />
                        <span className="ml-1">({ product.total_Rating_Quantity })</span>
                    </div>
                    <div className="text-text-title font-bold text-3xl">{ product.name }</div>
                    <div className="text-text-base text-base line-clamp-2 mt-3 mb-2">{ product.description }</div>
                </div>
            </Link>

            <div className="grid grid-cols-3 grid-rows-1 gap-2">
                <div className="text-red-500 font-bold text-sm">
                    Joined: <span className="ml-2 text-base">{ order.level }</span>
                </div>

                <div className="col-span-2 text-red-500 font-bold text-lg">
                    Price: <span className="font-semibold">{ discountPrice || formattedPrice }</span> { ` ` }
                    <span className="text-xs line-through">{ order.level > 1 ? formattedPrice : '' }</span>
                </div>
            </div>

            <JoinedBuyButton item={ order } />
        </div>
    );
}
