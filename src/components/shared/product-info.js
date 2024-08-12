import sharedService from "@/services/sharedService";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import AddToCartButton from "./add-to-cart-button";

export default function ProductInfo({ product }) {
    const formattedPrice = sharedService.formatVietnamDong(product.price);
    const starRating =
        product.quantity_rating_value === 0 ? 0 : product.total_Rating_Value / product.total_Rating_Quantity;
    return (
        <>
            <div className="grid gap-4 md:gap-8">
                <div className="flex justify-center">
                    <Image
                        className="w-[85%] h-[auto] rounded-lg"
                        src={ product.imageUrl }
                        alt={ product.name }
                        width={ 600 }
                        height={ 600 }
                    />
                </div>
                {/* <div className="flex justify-center gap-4 items-center">
                    <button className="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                        <Image
                            className="w-[100%] h-[auto] rounded-lg"
                            src="/download.jpg"
                            alt="Product Image"
                            width={ 100 }
                            height={ 100 }
                        />
                        <span className="sr-only">View Image 1</span>
                    </button>
                    <button className="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                        <Image
                            className="w-[100%] h-[auto] rounded-lg"
                            src="/download.jpg"
                            alt="Product Image"
                            width={ 100 }
                            height={ 100 }
                        />
                        <span className="sr-only">View Image 2</span>
                    </button>
                    <button className="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                        <Image
                            className="w-[100%] h-[auto] rounded-lg"
                            src="/download.jpg"
                            alt="Product Image"
                            width={ 100 }
                            height={ 100 }
                        />
                        <span className="sr-only">View Image 3</span>
                    </button>
                    <button className="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                        <Image
                            className="w-[100%] h-[auto] rounded-lg"
                            src="/download.jpg"
                            alt="Product Image"
                            width={ 100 }
                            height={ 100 }
                        />
                        <span className="sr-only">View Image 4</span>
                    </button>
                </div> */}
            </div>

            <div className="grid gap-6 md:gap-10 items-start">
                <div className="grid gap-4">
                    <h1 className="font-bold text-3xl">{ product.name }</h1>

                    <div className="flex flex-row gap-x-10 text-2xl font-bold">
                        <span className="text-3xl">{ formattedPrice }</span>
                        <div className="flex text-sm items-center opacity-80">
                            <span className="mr-1">{ starRating.toFixed(1) }</span>
                            <FaStar color="gold" size={ 14 } />
                            <span className="ml-1">({ product.total_Rating_Quantity })</span>
                        </div>
                    </div>

                    <div className="text-sm leading-loose text-muted-foreground">
                        <p> { product.description } </p>
                    </div>
                </div>
                <AddToCartButton />
            </div>
        </>
    );
}
