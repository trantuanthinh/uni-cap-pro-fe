import ListItem from "@/components/shared/list-item";
import apiService from "@/services/api-service";
import { Button, Pagination } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SharedProducts() {
    const router = useRouter();
    const { Page } = router.query;
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const currentPage = Number(Page) || 1;

    useEffect(() => {
        if (router.isReady) {
            let option = {
                Filter: "isShare=true",
                Page: currentPage ?? 1,
            };

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
    }, [router.isReady, currentPage]);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, Page: 1 },
            });
        }
    }, [totalPages, currentPage]);

    function handlePageChange(newPage) {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, Page: newPage },
        });
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center max-w-screen-xl mx-auto py-6">
                <h1 className="text-3xl font-bold mb-4">Joined Orders</h1>
                {totalPages == 0 ? (
                    <div className="flex flex-col items-center justify-center my-8">
                        <p className="text-gray-500 text-center">No Orders to Join Yet</p>
                        <Button as={Link} href="/">
                            <p className="text-gray-500 text-center">Return To Home</p>
                        </Button>
                    </div>
                ) : (
                    <ListItem list={list} pageSize={pageSize} type={"product"} />
                )}
                {totalPages > 1 && (
                    <Pagination
                        loop
                        showControls
                        color="success"
                        radius="lg"
                        total={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                    />
                )}
            </div>
        </>
    );
}
