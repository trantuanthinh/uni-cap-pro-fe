import Image from "next/image";
import { FaStar } from "react-icons/fa";
import AddToCartButton from "./add-to-cart";

export default function ProductInfo({ item }) {
    return (
        <>
            <div class="grid gap-4 md:gap-8">
                <div className="flex justify-center">
                    <Image
                        className="w-[85%] h-[auto] rounded-lg"
                        src="/download.jpg"
                        alt="Product Image"
                        width={ 600 }
                        height={ 600 }
                    />
                </div>
                <div class="flex justify-center gap-4 items-center">
                    <button class="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                        <Image
                            className="w-[100%] h-[auto] rounded-lg"
                            src="/download.jpg"
                            alt="Product Image"
                            width={ 100 }
                            height={ 100 }
                        />
                        <span class="sr-only">View Image 1</span>
                    </button>
                    <button class="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                        <Image
                            className="w-[100%] h-[auto] rounded-lg"
                            src="/download.jpg"
                            alt="Product Image"
                            width={ 100 }
                            height={ 100 }
                        />
                        <span class="sr-only">View Image 2</span>
                    </button>
                    <button class="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                        <Image
                            className="w-[100%] h-[auto] rounded-lg"
                            src="/download.jpg"
                            alt="Product Image"
                            width={ 100 }
                            height={ 100 }
                        />
                        <span class="sr-only">View Image 3</span>
                    </button>
                    <button class="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                        <Image
                            className="w-[100%] h-[auto] rounded-lg"
                            src="/download.jpg"
                            alt="Product Image"
                            width={ 100 }
                            height={ 100 }
                        />
                        <span class="sr-only">View Image 4</span>
                    </button>
                </div>
            </div>

            <div class="grid gap-6 md:gap-10 items-start">
                <div class="grid gap-4">
                    <h1 class="font-bold text-3xl">Title</h1>

                    <div class="flex flex-row gap-x-10 text-2xl font-bold">
                        <span className="text-3xl">50,000vnd</span>
                        <div className="flex text-sm items-center opacity-80">
                            <span className="mr-1">4</span>
                            {/* <span className="mr-1">{ starRating.toFixed(1) }</span> */ }
                            <FaStar color="gold" size={ 14 } />
                            <span className="ml-1">(5)</span>
                        </div>
                    </div>

                    <div class="text-sm leading-loose text-muted-foreground">
                        <p>
                            Introducing the Acme Prism T-Shirt, a perfect blend of style and comfort for the modern individual. This
                            tee is crafted with a meticulous composition of 60% combed ringspun cotton and 40% polyester jersey,
                            ensuring a soft and breathable fabric that feels gentle against the skin.
                        </p>
                        <p>
                            The design of the Acme Prism T-Shirt is as striking as it is comfortable. The shirt features a unique
                            prism-inspired pattern that adds a modern and eye-catching touch to your ensemble.
                        </p>
                    </div>
                </div>
                <AddToCartButton />
            </div>
        </>
    );
}