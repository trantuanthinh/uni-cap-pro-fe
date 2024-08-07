import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./add-to-cart";

export default function ItemBlock({ id, title, description, imageUrl, price }) {

    return (
        <div className="flex flex-col  overflow-hidden shadow-xl p-4 m-5 bg-white transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100">

            <Link href={ `/products/detail/${id}` } key={ id }>
                <div className="flex-shrink-0 border-4 border-rich-brown  mb-2">
                    <Image className="rounded" src={ imageUrl } alt={ title } width={ 240 } height={ 240 } />
                </div>

                <div className="py-4">
                    <p className="text-text-title font-bold text-3xl">{ title }</p>
                    <p className="text-text-base text-base line-clamp-2 mt-3 mb-2">{ description }</p>
                    <p className="text-red-500 font-bold text-lg">Price: { price }</p>
                </div>
            </Link>

            <div className="flex justify-end h-auto">
                <AddToCartButton />
            </div>
        </div>
    );
}
