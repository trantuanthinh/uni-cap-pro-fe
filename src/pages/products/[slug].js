import ListItem from "@/components/shared/list-item";
import apiService from "@/services/api-service";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Products({ children }) {
    const router = useRouter();
    const { slug } = router.query;
    const [ list, setList ] = useState([]);
    const page = useRef(1);

    useEffect(() => {
        if (router.isReady && slug) {
            if (slug === "") {
                getAllProducts();
            }
        }
    }, [ slug, router.isReady ]);

    function getAllProducts() {
        let option = { page: page };
        apiService
            .getProducts(option)
            .then((productRes) => {
                setList(productRes.result.data);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    }

    return (
        <>
            <div className="max-w-screen-xl mx-auto py-6">
                <h1 className="text-3xl text-center font-bold mb-4">All Product</h1>
                <ListItem productList={ list } />
            </div>
        </>
    );
}
