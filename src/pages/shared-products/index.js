import ListItem from "@/components/shared/list-item";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import { Pagination } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SharedProducts() {
    const router = useRouter();
    const { Page } = router.query;
    const [ list, setList ] = useState([]);
    const [ totalPages, setTotalPages ] = useState(0);
    const [ pageSize, setPageSize ] = useState(0);
    const currentPage = Number(Page) || 1;

    useEffect(() => {
        if (router.isReady) {
            let option = {
                Filter: "isShare=true && isPaid=false",
            };

            if (!sharedService.isNullOrEmpty(Page)) {
                option.page = Page;
            }
            apiService
                .getOrders(option)
                .then((orderRes) => {
                    let res = orderRes.result;
                    let calculatedTotalPages = Math.ceil(res.totalRecords / res.pageSize);
                    setList(res.data);
                    setPageSize(res.pageSize);
                    setTotalPages(calculatedTotalPages);
                })
                .catch((error) => {
                    console.log("Error: ", error.message);
                    toast.error("Error: ", error.message);
                });
        }
    }, [ router.isReady, currentPage ]);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, Page: 1 },
            });
        }
    }, [ totalPages, currentPage ]);

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
                <ListItem list={ list } pageSize={ pageSize } type={ "shared-product" } />
                <Pagination
                    loop
                    showControls
                    color="success"
                    radius="lg"
                    total={ totalPages }
                    page={ currentPage }
                    onChange={ handlePageChange }
                />
            </div>
        </>
    );
}
