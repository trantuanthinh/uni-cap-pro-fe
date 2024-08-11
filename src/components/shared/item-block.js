import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import AddToCartButton from "./add-to-cart";
import sharedService from "@/services/sharedService";

export default function ItemBlock({
    id,
    name,
    description,
    imageUrl,
    price,
    total_rating_value = 0,
    quantity_rating_value = 0,
}) {
    const starRating = quantity_rating_value === 0 ? 0 : total_rating_value / quantity_rating_value;
    const formattedPrice = sharedService.formatVietnamDong(price);

    return (
        <div className="grid grid-flow-row grid-rows-1 overflow-hidden shadow-xl p-4 m-5 bg-white transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100">
            <Link href={ `/products/detail/${id}` }>
                <div className="flex-shrink-0 border-4 rounded-lg border-rich-brown mb-2">
                    <Image className="rounded" src={ imageUrl } alt={ name } width={ 240 } height={ 240 } />
                </div>
                <div className="grid grid-flow-row py-4">
                    <div className="flex opacity-50">
                        <span className="mr-1">{ starRating.toFixed(1) }</span>
                        <FaStar color="gold" size={ 24 } />
                        <span className="ml-1">({ quantity_rating_value })</span>
                    </div>
                    <div className="text-text-title font-bold text-3xl">{ name }</div>
                    <div className="text-text-base text-base line-clamp-2  mt-3 mb-2">
                        { description }
                    </div>
                </div>
            </Link>

            <div className="text-red-500 font-bold text-lg text-end">Price: { formattedPrice }</div>
            <AddToCartButton />
        </div>
    );
}
