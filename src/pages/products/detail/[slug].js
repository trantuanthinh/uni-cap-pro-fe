import { useRouter } from "next/router";

export default function ProductDetail({children}) {
    const router = useRouter();
    const { slug } = router.query;return (
        <div>
            slug: {slug} products/details
        </div>
    );
}