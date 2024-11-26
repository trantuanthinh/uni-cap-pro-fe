import ListItem from "@/components/shared/list-item";
import GroupCartList from "@/components/shared/lists/group-cart-list";
import LoadingIndicator from "@/components/shared/loading-indicator";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import { Input, Pagination } from "@nextui-org/react";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function GroupBuy() {
    const user = useSelector((state) => state.user);
    const router = useRouter();
    const { slug } = router.query;
    const groupCart = useSelector((state) => state.groupCart);

    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [groupOrder, setGroupOrder] = useState(null);
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedGroupBuy, setSelectedGroupBuy] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [timeLeft, setTimeLeft] = useState(null);

    // Fetch group buy details on component load
    useEffect(() => {
        if (router.isReady && slug) {
            apiService
                .getOrder(slug)
                .then((res) => {
                    setGroupOrder(res.result);
                    setStore(res.result.store);
                    setTimeLeft(sharedService.formatToTime(res.result?.timeLeft));
                    let storeId = res.result.storeId;
                    apiService
                        .getProductsByStoreId(storeId)
                        .then((productRes) => {
                            const res = productRes.result;
                            setProducts(res.data);
                            setTotalPages(Math.ceil(res.totalRecords / res.pageSize));
                        })
                        .catch((error) => {
                            console.error("Error fetching products: ", error);
                            toast.error("Failed to fetch products. Please try again later.");
                        });
                })
                .catch((error) => {
                    console.log("Error: ", error.message);
                    toast.error("Error: ", error.message);
                });
            setIsLoading(false);
        }
    }, [router.isReady, slug]);

    // Debounced fetch products function
    const fetchProducts = useCallback(
        debounce(() => {
            const options = {
                Page: currentPage,
            };

            let search = document.getElementById("search").value.trim();
            if (search) {
                options.Filter = `Name.contains("${ search }")`;
            }

            if (store && store.id) {
                apiService
                    .getProductsByStoreId(store.id, options)
                    .then((productRes) => {
                        const res = productRes.result;
                        setProducts(res.data);
                        setTotalPages(Math.ceil(res.totalRecords / res.pageSize));
                    })
                    .catch((error) => {
                        toast.error("Error: ", error.message);
                        console.error("Error: ", error.message);
                    });
            }
        }, GlobalSettings.Settings.debounceTimer.valueChanges),
        [currentPage] // Added store and searchTerm as dependencies
    );

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handle dialog open
    const handleOpenDialog = (groupBuy) => {
        setSelectedGroupBuy(groupBuy);
        setIsDialogOpen(true);
    };

    // Handle dialog close
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedGroupBuy(null);
    };

    // Ensure mounted before rendering content
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch products whenever store or page changes
    useEffect(() => {
        if (store && currentPage) {
            fetchProducts();
        }
    }, [currentPage, store]);

    // Loading state
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Group Buy`} />
            <div className="m-6 rounded-lg">
                {isMounted && user && groupOrder ? (
                    <div className="grid grid-cols-10 gap-6">
                        {/* Left Column */}
                        <div className="col-span-2">
                            <div className="flex flex-col">
                                <p className="text-lg font-bold pt-2">Order ID: #{groupOrder.id}</p>
                                <p className="text-sm mb-4 text-red-600 font-semibold">Ends in: {timeLeft}</p>
                            </div>

                            <div className="rounded-lg">
                                <div className="mb-2 rounded-lg border-3 border-green-700">
                                    {Array.isArray(groupOrder.sub_Orders) &&
                                        groupOrder.sub_Orders.map((subOrder, index) => (
                                            <div key={subOrder.id} className="p-2 shadow-md flex flex-col justify-center">
                                                <h1 className="text-lg font-semibold">Sub_Order #{index + 1}</h1>
                                                <p className="text-sm font-semibold text-gray-600">ID: #{subOrder.id}</p>
                                                <p className="text-sm text-gray-600">Total Price: {subOrder.total_Price}</p>
                                            </div>
                                        ))}
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={() => handleJoinGroupBuy(groupOrder)}
                                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                        Join Group Buy
                                    </button>
                                    <button
                                        onClick={() => handleOpenDialog(groupOrder)}
                                        className="ml-2 px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600">
                                        Details
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold pb-2">Group Cart Items</h2>
                                    {groupCart.items.length > 0 ? (
                                        <GroupCartList
                                            items={groupCart.items}
                                            removeFromGroupCart={(id) => removeItem(CartType.shared_cart, id)}
                                            removeFromCheckout={(id) => dispatch(removeItemFromCheckout(id))}
                                        />
                                    ) : (
                                        <p className="text-gray-500">Your group cart is empty.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-span-8">
                            <h1 className="text-xl font-semibold">Store: {store.name}</h1>
                            <p className="text-sm text-gray-600">Phone Number: {store.phoneNumber}</p>
                            <div className="basis-10/12 w-full flex flex-col items-center space-y-4">
                                <Input
                                    className="w-full px-4 py-2 rounded-lg"
                                    placeholder="Search Products' Name"
                                    type="text"
                                    id="search"
                                    onChange={(e) => fetchProducts()}
                                />
                                <ListItem list={products} type="group-buy" />
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
                    </div>
                ) : (
                    <div>No group buy details found.</div>
                )}

                {isDialogOpen && selectedGroupBuy && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-lg w-1/2">
                            <h2 className="text-xl font-bold mb-2">{selectedGroupBuy.name}</h2>
                            <p className="text-gray-700">{selectedGroupBuy.description}</p>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleCloseDialog}
                                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
