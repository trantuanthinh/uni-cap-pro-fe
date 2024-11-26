import LoadingIndicator from "@/components/shared/loading-indicator";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function GroupBuy() {
    const user = useSelector((state) => state.user);
    const router = useRouter();
    const { slug } = router.query;

    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [groupOrder, setGroupOrder] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedGroupBuy, setSelectedGroupBuy] = useState(null);

    // Fetch group buy details on component load
    useEffect(() => {
        if (router.isReady && slug) {
            apiService
                .getOrder(slug)
                .then((res) => {
                    setGroupOrder(res.result);
                })
                .catch((error) => {
                    console.log("Error: ", error.message);
                    toast.error("Error: ", error.message);
                });
            setIsLoading(false);
        }
    }, [router.isReady, slug]);

    const handleJoinGroupBuy = async (groupBuy) => {
        if (!user) {
            toast.error("Please login to join group buy");
            return;
        }

        try {
            const res = await apiService.joinGroupBuy(groupBuy.id, user.id);
            if (res.ok) {
                toast.success("Joined group buy successfully");
                setGroupOrder((prev) => ({
                    ...prev,
                    joined: true,
                }));
            } else {
                toast.error("Failed to join group buy");
            }
        } catch (error) {
            toast.error("An error occurred while joining group buy");
        }
    };

    const handleCancelJoinGroupBuy = async (groupBuy) => {
        if (!user) {
            toast.error("Please login to cancel join group buy");
            return;
        }

        try {
            const res = await apiService.cancelJoinGroupBuy(groupBuy.id, user.id);
            if (res.ok) {
                toast.success("Cancelled join group buy successfully");
                setGroupOrder((prev) => ({
                    ...prev,
                    joined: false,
                }));
            } else {
                toast.error("Failed to cancel join group buy");
            }
        } catch (error) {
            toast.error("An error occurred while cancelling group buy");
        }
    };

    const handleOpenDialog = (groupBuy) => {
        setSelectedGroupBuy(groupBuy);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedGroupBuy(null);
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Group Buy`} />
            {isMounted && user && groupOrder ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Group Buy Opportunities</h1>
                    <div className="border p-4 rounded shadow-md bg-white">
                        <h2 className="text-lg font-semibold">{groupOrder.name}</h2>
                        <p className="text-sm text-gray-600">{groupOrder.description}</p>
                        <div className="mt-4">
                            {groupOrder.joined ? (
                                <button
                                    onClick={() => handleCancelJoinGroupBuy(groupOrder)}
                                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                                    Cancel Join
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleJoinGroupBuy(groupOrder)}
                                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                    Join Group Buy
                                </button>
                            )}
                            <button
                                onClick={() => handleOpenDialog(groupOrder)}
                                className="ml-2 px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600">
                                Details
                            </button>
                        </div>
                    </div>

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
            ) : (
                <div>No group buy details found.</div>
            )}
        </>
    );
}
