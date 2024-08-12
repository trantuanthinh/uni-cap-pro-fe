import sharedService from "@/services/sharedService";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import AddToCartButton from "./add-to-cart-button";
import BuyTogetherButton from "./buy-together-button";

export default function ItemCard({ id, product, type = "cart" }) {
    let button;

    if (type === "cart") {
        button = <AddToCartButton item={ product } />;
    } else if (type === "buy-together") {
        button = <BuyTogetherButton item={ product } />;
    }

    const starRating =
        product.total_Rating_Quantity === 0 ? 0 : product.total_Rating_Value / product.total_Rating_Quantity;
    const formattedPrice = sharedService.formatVietnamDong(product.price);

    return (
        <div className="grid grid-flow-row grid-rows-1 overflow-hidden shadow-xl p-4 m-5 bg-white transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100">
            <Link href={ `/products/detail/${id}` }>
                <div className="flex-shrink-0 border-4 rounded-lg border-rich-brown mb-2">
                    <Image
                        className="rounded"
                        src={ product.imageUrl }
                        alt={ product.name }
                        width={ 240 }
                        height={ 240 }
                    />
                </div>
                <div className="grid grid-flow-row py-4">
                    <div className="flex opacity-50">
                        <span className="mr-1">{ starRating.toFixed(1) }</span>
                        <FaStar color="gold" size={ 24 } />
                        <span className="ml-1">({ product.total_Rating_Quantity })</span>
                    </div>
                    <div className="text-text-title font-bold text-3xl">{ product.name }</div>
                    <div className="text-text-base text-base line-clamp-2  mt-3 mb-2">{ product.description }</div>
                </div>
            </Link>

            <div className="text-red-500 font-bold text-lg text-end">Price: { formattedPrice }</div>
            { button }
        </div>
    );
}
