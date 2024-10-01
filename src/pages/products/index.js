import ListItem from "@/components/shared/list-item";
import apiService from "@/services/api-service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Products() {
    const router = useRouter();
    const { Page } = router.query;
    const [ list, setList ] = useState([]);

    useEffect(() => {
        if (router.isReady) {
            getAllProducts();
        }
    }, [ router.isReady, Page ]);

    function getAllProducts() {
        let option = { page: Page || 1 };
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
                <h1 className="text-3xl text-center font-bold mb-4">All Products</h1>
                <ListItem productList={ list } />
            </div>
        </>
    );
}
