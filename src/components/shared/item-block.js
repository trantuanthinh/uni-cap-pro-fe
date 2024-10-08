import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import AddToCartButton from "./add-to-cart";

export default function ItemBlock({
    id,
    title,
    description,
    imageUrl,
    price,
    total_rating_value = 100,
    quantity_rating_value = 10,
}) {
    const starRating = total_rating_value / quantity_rating_value;

    return (
        <div className="flex flex-col overflow-hidden shadow-xl p-4 m-5 bg-white transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100">

            <Link href={ `/products/detail/${id}` } className="flex flex-col h-full">
                <div className="flex-shrink-0 border-4 border-rich-brown mb-2">
                    <Image className="rounded" src={ imageUrl } alt={ title } width={ 240 } height={ 240 } />
                </div>
                <div className="py-4">
                    <div className="flex items-center mt-2 opacity-50">
                        <span className="mr-1">{ starRating.toFixed(1) }</span>
                        <FaStar color="gold" size={ 24 } />
                        <span className="ml-1">({ quantity_rating_value })</span>
                    </div>
                    <p className="text-text-title font-bold text-3xl">{ title }</p>
                    <p className="text-text-base text-base line-clamp-2 mt-3 mb-2">{ description }</p>
                    <p className="text-red-500 font-bold text-lg">Price: { price }</p>
                </div>
            </Link>

            <div className="flex justify-end h-auto mt-4">
                <AddToCartButton />
            </div>
        </div>
    );
}
