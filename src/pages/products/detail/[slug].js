import CommentCard from "@/components/shared/cards/comment-card";
import ProductInfo from "@/components/shared/product-info";
import apiService from "@/services/api-service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (router.isReady && slug) {
            Promise.all([apiService.getProduct(slug), apiService.getFeedbacksByProductId(slug)])
                .then(([prodRes, commentRes]) => {
                    setProduct(prodRes.result);
                    setComments(commentRes.result);
                })
                .catch((error) => {
                    console.log("Error fetching product: ", error);
                    toast.error("Error: " + error.message);
                });
        }
    }, [slug, router.isReady]);

    return (
        <>
            {product ? (
                <div className="max-w-screen-xl mx-auto py-6">
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
                        <ProductInfo product={product} />
                    </div>
                    <div className="p-4 mt-10 space-y-2">
                        <h2 className="text-2xl font-bold mb-4">Comments</h2>
                        {/* <div className="flex flex-row justify-center items-center">
                            <Input
                                type="text"
                                id="comment"
                                label="Comment"
                                placeholder="Review your experience"
                                endContent={
                                    <button
                                        onClick={handleComment}
                                        className="h-full rounded-md bg-primary-green hover:bg-green-700 px-4 py-2 text-white hover:bg-primary-green-dark transition duration-150 ease-in-out"
                                    >
                                        Submit
                                    </button>
                                }
                            />
                        </div> */}
                        {Array.isArray(comments) &&
                            comments.map((comment) => (
                                <div key={comment.id} className="mb-4">
                                    <CommentCard
                                        avatar={comment.user.avatar ?? null}
                                        username={comment.user.username}
                                        comment={comment.content}
                                        rating={comment.rating}
                                        timestamp={comment.modified_At}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                <p>Loading product details...</p>
            )}
        </>
    );
}
