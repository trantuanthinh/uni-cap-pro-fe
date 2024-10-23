import sharedService from "@/services/sharedService";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import AddToCartButton from "../buttons/add-to-cart-button";

export default function ItemCard({ product }) {
    const starRating = product.total_Rating_Quantity === 0 ? 0 : product.total_Rating_Value / product.total_Rating_Quantity;
    const formattedPrice = sharedService.formatVietnamDong(product.price);

    return (
        <div className="flex flex-col p-4 m-5 bg-white shadow-xl transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100">
            <Link href={`/products/detail/${ product.id }`}>
                <div className="flex justify-center mb-2">
                    <div className="flex border-4 size-52 rounded-lg border-rich-brown">
                        <Image
                            className="rounded object-cover"
                            src={product.images[0]}
                            alt={product.name}
                            width={240}
                            height={240}
                        />
                    </div>
                </div>

                <div className="grid grid-flow-row py-4">
                    <div className="flex opacity-50">
                        <span className="mr-1">{starRating.toFixed(1)}</span>
                        <FaStar color="gold" size={24} />
                        <span className="ml-1">({product.total_Rating_Quantity})</span>
                    </div>
                    <div className="text-text-title font-bold text-2xl sm:text-3xl">{product.name}</div>
                    <div className="text-text-base text-sm sm:text-base line-clamp-2 mt-3 mb-2">{product.description}</div>
                </div>
            </Link>

            <div className="flex flex-row justify-between items-center mt-2">
                <span className="text-lg sm:text-xl font-semibold">Price: {formattedPrice}</span>
            </div>

            <AddToCartButton item={product} />
        </div>
    );
}
