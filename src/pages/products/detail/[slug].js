// import CommentCard from "@/components/shared/comment-card";
import ProductInfo from "@/components/shared/product-info";
import apiService from "@/services/api-service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProductDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState();

    useEffect(() => {
        if (router.isReady && slug) {
            // Fetch product only if the slug is available and router is ready
            apiService.getProduct(slug)
                .then(response => setProduct(response.result))
                .catch(error => console.log("Error fetching product: ", error));
        }
    }, [slug, router.isReady]);
    return (
        <>
            {product ? (
                <div className="max-w-screen-xl mx-auto py-6">
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
                        <ProductInfo product={product} />
                    </div>
                    <div className="p-4 mt-10">
                        <h2 className="text-2xl font-bold mb-4">Comments</h2>
                        {/* Render CommentCard components here */}
                    </div>
                </div>
            ) : (
                <p>Loading product details...</p>
            )}
        </>
    );
}
