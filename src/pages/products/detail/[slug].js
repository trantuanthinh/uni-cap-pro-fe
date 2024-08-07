import AddToCartButton from "@/components/shared/add-to-cart";
import apiService from "@/services/api-service";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function ProductDetail({ total_rating_value = 100, quantity_rating_value = 10 }) {
    const router = useRouter();
    const { slug } = router.query;
    const starRating = total_rating_value / quantity_rating_value;

    const [product, setProduct] = useState([]);

    useEffect(() => {
        fetchItem();
    }, [slug]);

    async function fetchItem() {
        try {
            const response = await apiService.getUsers();
            setProduct(response);
            console.log(response);
        } catch (error) {
            console.log("Error: " + error);
            setMessage("Error");
        }
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-10">
            <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <Image
                        className="rounded-lg"
                        src="/download.jpg"
                        alt="Product Image"
                        width={ 400 }
                        height={ 400 }
                    />
                </div>

                <div className="flex-grow">
                    <div className="flex items-center mt-2 opacity-50">
                        <span className="mr-1">{ starRating.toFixed(1) }</span>
                        <FaStar color="gold" size={ 24 } />
                        <span className="ml-1">({ quantity_rating_value })</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Product Title</h2>
                    <p className="text-gray-700 mb-4">
                        Description of the product goes here. It can be a detailed description of the features,
                        benefits, and other relevant information.
                    </p>
                    <p className="text-xl font-semibold text-gray-900">Price: $99.99</p>
                    <AddToCartButton />
                </div>
            </div>
        </div>
    );
}
