import sharedService from "@/services/sharedService";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import AddToCartButton from "./buttons/add-to-cart-button";

export default function ProductInfo({ product = null }) {
    const [ quantity, setQuantity ] = useState(1);

    const formattedPrice = sharedService.formatVietnamDong(product.price);
    const starRating = product.total_Rating_Value === 0 ? 0 : product.total_Rating_Value / product.total_Rating_Quantity;
    return (
        <>
            <div className="grid gap-4 md:gap-8">
                <div className="flex justify-center w-full">
                    <Image
                        className="w-[90%] h-[80%] rounded-lg"
                        src={ product.images[ 0 ] }
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
                    <div className="mt-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm text-gray-600">Quantity</h3>
                        </div>
                    </div>
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
                <div className="flex items-center mt-2">
                    <Button type="button" variant="outline" size="icon" onClick={ () => setQuantity(Math.max(1, quantity - 1)) }>
                        <IoMdRemoveCircleOutline size={ 24 } />
                    </Button>
                    <span className="mx-4 text-xl font-semibold">{ quantity }</span>
                    <Button type="button" variant="outline" size="icon" onClick={ () => setQuantity(Math.min(10, quantity + 1)) }>
                        <IoMdAddCircleOutline size={ 24 } />
                    </Button>
                    {/* <AddToCartButton item={ product } /> */ }
                </div>
                <AddToCartButton item={ product } />
            </div>
        </>
    );
}
