import ListItem from "@/components/shared/list-item";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import { useAppContext } from "@/contexts/AppContext";
import apiService from "@/services/api-service";
import { Button, Input, Pagination } from "@nextui-org/react";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "sonner";

export default function Products() {
    const router = useRouter();
    const { Page, CategoryId } = router.query;
    const { mainCategories, categoryItems } = useAppContext();

    const [openMainCategory, setOpenMainCategory] = useState(true);
    const [openCategory, setOpenCategory] = useState(null);
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMainCategory(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const currentPage = Number(Page) || 1;
    const [list, setList] = useState([]);
    const [isAscPrice, setIsAscPrice] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [search, setSearch] = useState("");

    const fetchProducts = useCallback(
        debounce(() => {
            const option = {
                Page: currentPage,
                SortBy: "Price",
                SortOrder: isAscPrice ? "asc" : "desc",
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
    }, [router.isReady, currentPage, CategoryId, search, isAscPrice]);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, Page: 1, CategoryId },
            });
        }
    }, [totalPages, currentPage]);

    const handleMouseEnter = (menuId) => setOpenCategory(menuId);
    const handleMouseLeave = () => setOpenCategory(null);

    const getCategories = useMemo(() => {
        return categoryItems.find((item) => item.MainCategoryId === openCategory)?.Categories || [];
    }, [categoryItems, openCategory]);

    const handlePageChange = (newPage) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, Page: newPage, CategoryId },
        });
    };

    const handleSearch = (input) => {
        setSearch(input);
        const query = { ...router.query };

        if (input.trim() === "") {
            delete query.name;
        } else {
            query.name = input;
        }

        router.push({ pathname: router.pathname, query });
    };

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Products`} />
            <h1 className="text-3xl font-bold mb-4">All Products</h1>
            <div className="flex flex-row min-w-screen py-6 px-4 space-x-2">
                <div className="flex flex-col basis-1/4 bg-orange-400">
                    <Input
                        className="w-full px-4 py-2 rounded-lg"
                        placeholder="Search Products' Name"
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <Button onClick={() => setOpenMainCategory(true)}>Categories</Button>

                    {openMainCategory && (
                        <div ref={menuRef} className="relative">
                            <ul className="absolute left-0 top-0 bg-white border border-gray-300 shadow-lg rounded w-max">
                                {mainCategories.map((mainCategory) => (
                                    <li
                                        key={mainCategory.id}
                                        className="relative"
                                        onMouseEnter={() => handleMouseEnter(mainCategory.id)}
                                        onMouseLeave={handleMouseLeave}>
                                        <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            {mainCategory.name}
                                            <span>
                                                <IoIosArrowForward />
                                            </span>
                                        </div>

                                        {openCategory === mainCategory.id && (
                                            <ul className="absolute left-full top-0 bg-white border border-gray-300 shadow-lg rounded w-max">
                                                {getCategories.map((category) => (
                                                    <li
                                                        key={category.id}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() =>
                                                            router.push({
                                                                pathname: router.pathname,
                                                                query: { ...router.query, CategoryId: category.id },
                                                            })
                                                        }>
                                                        {category.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Button
                        className="text-white rounded-lg text-base font-medium"
                        onClick={() => {
                            setIsAscPrice((prev) => !prev);
                            router.push({
                                pathname: router.pathname,
                                query: { ...router.query, SortBy: "Price", SortOrder: isAscPrice ? "desc" : "asc" },
                            });
                        }}
                        color="primary">
                        Price {isAscPrice ? <FaArrowUp size={22} /> : <FaArrowDown size={22} />}
                    </Button>
                </div>

                <div className="basis-2/4">
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
