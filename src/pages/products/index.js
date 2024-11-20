import ListItem from "@/components/shared/list-item";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { useAppContext } from "@/contexts/AppContext";
import apiService from "@/services/api-service";
import { Button, Input, Pagination, Radio, RadioGroup } from "@nextui-org/react";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { GoDash } from "react-icons/go";

export default function Products() {
    const router = useRouter();
    const { Page, CategoryId } = router.query;
    const { mainCategories, categoryItems } = useAppContext();

    const [list, setList] = useState([]);
    const [isAscPrice, setIsAscPrice] = useState(null);
    const [isAlpha, setIsAlpha] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [search, setSearch] = useState("");

    const currentPage = Number(Page) || 1;

    // Fetch products
    const fetchProducts = useCallback(
        debounce(() => {
            const options = {
                Page: currentPage,
            };

            if (isAlpha) {
                options.SortBy = "Name";
                options.SortOrder = isAlpha ? "asc" : "desc";
            } else if (isAscPrice) {
                options.SortBy = "Price";
                options.SortOrder = isAscPrice ? "asc" : "desc";
            }

            if (CategoryId) {
                options.Filter = `CategoryId = "${ CategoryId }"`;
            }

            if (search) {
                const searchFilter = `Name.contains("${ search }")`;
                options.Filter = options.Filter ? `${ options.Filter } AND ${ searchFilter }` : searchFilter;
            }

            apiService
                .getProducts(options)
                .then((productRes) => {
                    const res = productRes.result;
                    setList(res.data);
                    setPageSize(res.pageSize);
                    setTotalPages(Math.ceil(res.totalRecords / res.pageSize));
                })
                .catch((error) => {
                    console.error("Error fetching products: ", error);
                    toast.error("Failed to fetch products. Please try again later.");
                });
        }, GlobalSettings.Settings.debounceTimer.valueChanges),
        [currentPage, CategoryId, isAscPrice, search]
    );

    useEffect(() => {
        if (router.isReady) {
            fetchProducts();
        }
        return () => {
            fetchProducts.cancel();
        };
    }, [router.isReady, currentPage, CategoryId, search, isAscPrice, isAlpha]);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            router.push({ pathname: router.pathname, query: { ...router.query, Page: 1 } });
        }
    }, [totalPages, currentPage]);

    const getCategories = (id) => {
        return categoryItems?.find((item) => item.MainCategoryId === id)?.Categories || [];
    };

    const handlePageChange = (newPage) => {
        router.push({ pathname: router.pathname, query: { ...router.query, Page: newPage } });
    };

    const handleSearch = debounce((input) => {
        setSearch(input.trim());
        const query = { ...router.query };

        if (input.trim() === "") {
            delete query.name;
        } else {
            query.name = input;
        }

        router.push({ pathname: router.pathname, query });
    }, 300);

    const handleCategoryChange = (value) => {
        const query = { ...router.query };

        if (value === "All") {
            delete query.CategoryId;
        } else {
            const selectedCategory = mainCategories
                ?.flatMap((mainCategory) => getCategories(mainCategory.id))
                .find((category) => category.name === value);

            if (selectedCategory) {
                query.CategoryId = selectedCategory.id;
            }
        }

        router.push({ pathname: router.pathname, query });
    };

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Products`} />
            <h1 className="text-3xl font-bold text-center">All Products</h1>
            <div className="flex flex-row pb-4 w-full px-4 space-x-2">
                {/* Sidebar */}
                <div className="flex flex-col basis-2/12">
                    <Input
                        className="w-full px-4 py-2 rounded-lg"
                        placeholder="Search Products' Name"
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <div className="space-x-2 pb-2">
                        {/* Price Sorting Button */}
                        <Button
                            className="text-white rounded-lg text-base font-medium mt-4"
                            onClick={() => {
                                setIsAscPrice((prev) => (prev === null ? true : !prev)); // Toggle or set default
                                setIsAlpha(null); // Reset alphabetical sorting when switching to price sorting
                            }}
                            color="primary">
                            Price {isAscPrice === null ? <GoDash /> : isAscPrice ? <FaArrowUp /> : <FaArrowDown />}
                        </Button>

                        {/* Alphabetical Sorting Button */}
                        <Button
                            className="text-white rounded-lg text-base font-medium mt-4"
                            onClick={() => {
                                setIsAlpha((prev) => (prev === null ? true : !prev)); // Toggle or set default
                                setIsAscPrice(null); // Reset price sorting when switching to alphabetical sorting
                            }}
                            color="primary">
                            Alphabet {isAlpha === null ? <GoDash /> : isAlpha ? <FaArrowUp /> : <FaArrowDown />}
                        </Button>
                    </div>

                    <div className="border-y border-gray-200 space-y-4">
                        <RadioGroup
                            className="pl-2"
                            label="Select Categories"
                            onValueChange={handleCategoryChange}
                            orientation="vertical">
                            <Radio key="all" value="All" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <span className="text-md">All</span>
                            </Radio>

                            {mainCategories.map((mainCategory) => {
                                return (
                                    <>
                                        <p className="text-sm font-semibold text-gray-400">{mainCategory.name}</p>
                                        {getCategories(mainCategory.id).map((category) => (
                                            <Radio
                                                key={category.id}
                                                value={category.name} // Pass category name as the value
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                <span className="text-md">{category.name}</span>
                                            </Radio>
                                        ))}
                                    </>
                                );
                            })}
                        </RadioGroup>
                    </div>
                </div>

                {/* Products List */}
                <div className="basis-10/12 w-full flex flex-col items-center space-y-4">
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
            </div>
        </>
    );
}
