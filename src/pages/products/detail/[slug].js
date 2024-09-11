import CommentCard from "@/components/shared/comment-card";
import ProductInfo from "@/components/shared/product-info";
import apiService from "@/services/api-service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProductDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (slug) {
            // Only fetch product if slug is available
            apiService.getProduct(slug)
                .then(response => setProduct(response.data))
                .catch(error => console.log("Error: ", error));
        }
    }, [slug]);

    return (
        <>
            { product ? (
                <div className="max-w-screen-xl mx-auto py-6">
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
                        <ProductInfo product={ product } />
                    </div>
                    <div className="p-4 mt-10">
                        <h2 className="text-2xl font-bold mb-4">Comments</h2>
                    </div>
                </div>
            ) : (
                <p>Loading product details...</p>
            ) }
        </>
    );
}
