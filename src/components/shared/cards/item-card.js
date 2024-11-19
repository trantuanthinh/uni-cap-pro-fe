import sharedService from "@/services/sharedService";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import AddToCartButton from "../buttons/add-to-cart-button";

export default function ItemCard({ product }) {
    const starRating = product.total_Rating_Quantity === 0 ? 0 : product.total_Rating_Value / product.total_Rating_Quantity;
    const formattedPrice = sharedService.formatVietnamDong(product.price);

    return (
        <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl">
            <Link href={`/products/detail/${ product.id }`}>
                <div className="relative w-full aspect-square mb-4">
                    <Image className="rounded-lg object-cover" src={product.images[0]} alt={product.name} layout="fill" />
                </div>

                <div className="text-center mb-4">
                    <div className="flex items-center justify-center mb-2 text-gray-600">
                        <span className="mr-1 text-lg font-medium">{starRating.toFixed(1)}</span>
                        <FaStar color="gold" size={18} />
                        <span className="ml-1 text-sm">({product.total_Rating_Quantity})</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-800">{product.name}</div>
                    <div className="text-sm sm:text-base text-gray-600 mt-2 line-clamp-2">{product.description}</div>
                </div>
            </Link>

            <div className="flex items-center justify-between mt-auto">
                <span className="text-lg sm:text-xl font-semibold text-primary">{formattedPrice}</span>
                <AddToCartButton item={product} />
            </div>
        </div>
    );
}
