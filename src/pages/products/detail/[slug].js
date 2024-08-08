import CommentCard from "@/components/shared/comment-card";
import ProductInfo from "@/components/shared/product-info";
import apiService from "@/services/api-service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProductDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const starRating = 4;
    const commentList = [
        {
            username: "thaohoang",
            timestamp: "2 hours ago",
            avatar: '/download.jpg',
            comment: "Love youdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsadawdsadasdasdasdawdasdasdasddddddddddd"
        },
    ];
    const [product, setProduct] = useState([]);

    useEffect(() => {
        fetchItem();
    }, [slug]);

    async function fetchItem() {
        try {
            const response = await apiService.getUsers();
            console.log(response);
            setProduct(response);
        } catch (error) {
            console.log("Error: " + error);
            setMessage("Error");
        }
    }

    return (
        <>
            <div className="max-w-screen-xl mx-auto py-6">
                <div class="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
                    <ProductInfo />
                </div>
                <div className="p-4 mt-10">
                    <h2 className="text-2xl font-bold mb-4">Comments</h2>
                    { commentList && commentList.map((item, index) => (
                        <CommentCard
                            key={ index }
                            avatar={ item.avatar }
                            username={ item.username }
                            timestamp={ item.timestamp }
                            comment={ item.comment }
                        />
                    )) }
                </div>
            </div>
        </>
    );
}
