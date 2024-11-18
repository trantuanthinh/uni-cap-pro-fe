import ListItem from "@/components/shared/list-item";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination } from "@nextui-org/react";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "sonner";

export default function Products() {
    const items = [
        {
            key: "new",
            label: "New file",
        },
        {
            key: "copy",
            label: "Copy link",
        },
        {
            key: "edit",
            label: "Edit file",
        },
        {
            key: "delete",
            label: "Delete file",
        },
    ];
    const router = useRouter();
    const { Page, CategoryId } = router.query;

    const currentPage = Number(Page) || 1;
    const [list, setList] = useState([]);
    const [isAscPrice, setIsAscPrice] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(0);
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

    const onSubmit = (input) => {
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

                <form
                    className="flex flex-row w-full justify-center items-center space-x-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        toast.success("Success!");
                    }}>
                    <div className="flex flex-col space-y-2">
                        <Button className="text-base font-medium" onClick={() => setIsAscPrice(!isAscPrice)}>
                            Price {isAscPrice ? <FaArrowUp size={14} /> : <FaArrowDown size={14} />}
                        </Button>

                        <Dropdown>
                            <DropdownTrigger>
                                <Button color="primary" className="text-base font-medium">
                                    Category <IoIosArrowDown size={14} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Dynamic Actions" items={items}>
                                {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <Input
                        className="w-[80%]"
                        label="Search Products' Name"
                        type="text"
                        id="search"
                        value={search}
                        onChange={(e) => onSubmit(e.target.value)}
                    />
                </form>

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
