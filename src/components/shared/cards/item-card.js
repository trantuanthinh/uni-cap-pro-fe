import sharedService from "@/services/sharedService";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export default function ItemCard({ product }) {
    const starRating = product.total_Rating_Quantity === 0 ? 0 : product.total_Rating_Value / product.total_Rating_Quantity;
    const formattedPrice = sharedService.formatVietnamDong(product.price);

    return (
        <div className="flex flex-col p-4">
            <Link href={`/products/detail/${ product.id }`}>
                <div className="relative w-full aspect-square mb-4">
                    <Image className="rounded-lg object-cover" src={product.images[0]} alt={product.name} layout="fill" />
                </div>

                <div className="text-center mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-md">{product.owner}</span>
                        <div className="flex flex-row justify-center items-center text-gray-600">
                            <span className="mr-1 text-lg font-medium">{starRating.toFixed(1)}</span>
                            <FaStar color="gold" size={18} />
                            <span className="ml-1 text-sm">({product.total_Rating_Quantity})</span>
                        </div>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-1">{product.name}</div>
                    <div className="text-sm text-start sm:text-base text-gray-600 mt-2 line-clamp-2">
                        {product.description}
                    </div>
                </div>
            </Link>

            <div className="flex items-center justify-between mt-auto">
                <div>
                    <span className="text-lg sm:text-xl font-semibold text-primary">{formattedPrice}</span>
                    <span className="text-[14px] text-gray-600">
                        |Sold:{" "}
                        {product.total_Sold_Quantity >= 10000
                            ? `${ Math.floor(product.total_Sold_Quantity / 1000) }k`
                            : product.total_Sold_Quantity}
                    </span>
                </div>
            </div>
        </div>
    );
}
