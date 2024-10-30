import ListItem from "@/components/shared/list-item";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import { Input, Pagination } from "@nextui-org/react";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Products() {
    const router = useRouter();
    const { Page, CategoryId } = router.query;
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const currentPage = Number(Page) || 1;
    const [search, setSearch] = useState("");

    // Fetch products when the router is ready and Page/CategoryId/search changes
    useEffect(() => {
        if (router.isReady) {
            const fetchProducts = debounce(() => {
                const option = {
                    Page: currentPage,
                    SortBy: "total_Rating_Value",
                    SortOrder: "desc",
                };
                if (CategoryId) {
                    option.Filter = `CategoryId = "${ CategoryId }"`;
                }
                if (search) {
                    const searchFilter = `Name.contains("${ search }")`;
                    option.Filter = option.Filter ? `${ option.Filter } AND ${ searchFilter }` : searchFilter;
                }

                apiService
                    .getProducts(option)
                    .then((productRes) => {
                        const res = productRes.result;
                        setList(res.data);
                        setPageSize(res.pageSize);
                        setTotalPages(Math.ceil(res.totalRecords / res.pageSize));
                    })
                    .catch((error) => {
                        console.error("Error: ", error);
                        toast.error(`Error: ${ error.message }`);
                    });
            }, GlobalSettings.Settings.debounceTimer.valueChanges); // Adjust debounce timing here

            fetchProducts();

            return () => {
                fetchProducts.cancel();
            };
        }
    }, [router.isReady, currentPage, CategoryId, search]);


    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, Page: 1, CategoryId },
            });
        }
    }, [totalPages, currentPage]);

    function handlePageChange(newPage) {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, Page: newPage, CategoryId },
        });
    }

    const handleChange = (input) => {
        setSearch(input);

        const query = { ...router.query };
        if (input === "") {
            delete query.name;
        } else {
            query.name = input;
        }

        router.push({
            pathname: router.pathname,
            query,
        });
    };

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Products`} />
            <div className="flex flex-col items-center justify-center max-w-screen-xl mx-auto py-6">
                <h1 className="text-3xl font-bold mb-4">All Products</h1>
                <Input
                    label="Search Products' Name"
                    type="text"
                    id="search"
                    value={search}
                    onChange={(e) => handleChange(e.target.value)}
                />

                <ListItem list={list} pageSize={pageSize} type="product" id="search" />
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
