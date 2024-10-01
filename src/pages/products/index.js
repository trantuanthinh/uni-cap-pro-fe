import ListItem from "@/components/shared/list-item";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import { Pagination } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Products() {
    const router = useRouter();
    const { Page } = router.query;
    const [ list, setList ] = useState([]);
    const pageSize = 8; // Define pageSize or pass it as a prop if needed

    useEffect(() => {
        if (router.isReady) {
            const option = sharedService.isNullOrEmpty(Page) ? {} : { page: Page };
            apiService
                .getProducts(option)
                .then((productRes) => {
                    setList(productRes.result.data);
                })
                .catch((error) => {
                    console.log("Error: ", error);
                });
        }
    }, [ router.isReady, Page ]);

    function handlePageChange(newPage) {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, Page: newPage },
        });
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center max-w-screen-xl mx-auto py-6">
                <h1 className="text-3xl font-bold mb-4">All Products</h1>
                <ListItem productList={ list } pageSize={ pageSize } />
                <Pagination
                    loop
                    showControls
                    color="success"
                    total={ 10 }
                    page={ Number(Page) || 1 }
                    onChange={ handlePageChange }
                />
            </div>
        </>
    );
}
