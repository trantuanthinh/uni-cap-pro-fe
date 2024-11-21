import { OrderType } from "@/configurations/data-settings";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import { Button, Image } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "../default-confirm-dialog";

export default function CheckoutList({ user, items = [], removeItem }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Group items by shop name
    const groupedItems = items.reduce((acc, item) => {
        const shopName = item?.owner || "Unknown Shop";
        if (!acc[shopName]) {
            acc[shopName] = [];
        }
        acc[shopName].push(item);
        return acc;
    }, {});

    const handleCartBuy = async (shopName) => {
        let totalPrice = groupedItems[shopName].reduce((total, item) => total + item.price * item.totalItemQuantity, 0);

        const dataJson = {
            itemRequests: groupedItems[shopName].map((item) => ({
                productId: item.id,
                quantity: item.totalItemQuantity,
            })),
            userId: user.id,
            districtId: user.districtId,
            totalPrice: totalPrice,
            isShare: groupedItems[shopName].some((item) => item.order_type === OrderType.shared_order),
        };

        try {
            const res = await apiService.postOrder(dataJson);
            if (res.ok) {
                toast.success("Orders created successfully");
                groupedItems[shopName].forEach((item) => {
                    removeItem(item.cart_type, item.id);
                });
            }
        } catch (error) {
            toast.error(`Error: ${ error.message }`);
            console.error("Error:", error.message);
        } finally {
            setIsDialogOpen(false);
        }
    };

    return (
        <>
            {Object.keys(groupedItems).map((shopName) => {
                const itemsInShop = groupedItems[shopName];
                const type = itemsInShop[0]?.order_type === OrderType.shared_order ? "Shared Orders" : "Individual Orders";
                const totalPriceOfShop = itemsInShop.reduce((total, item) => total + item.price * item.totalItemQuantity, 0);

                return (
                    <div key={shopName} className="mb-8">
                        {/* Shop Header */}
                        <div className="flex items-center justify-between mb-4 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {shopName}
                                <span className="text-gray-600 text-sm">: {type}</span>
                            </h2>
                            <div className="flex flex-col items-end space-y-2">
                                {/* Buy Button */}
                                <Button
                                    className="bg-success hover:bg-success-300 text-white font-semibold px-6 rounded-lg transition duration-300"
                                    onClick={() => setIsDialogOpen(true)}>
                                    Buy
                                </Button>
                                <span className="text-black text-lg font-medium">
                                    Total: {sharedService.formatVietnamDong(totalPriceOfShop)}
                                </span>
                                <ConfirmDialog
                                    title="Confirm Purchase?"
                                    content="Are you sure you want to buy all items in your checkout?"
                                    isOpen={isDialogOpen}
                                    onOpenChange={setIsDialogOpen}
                                    onSubmit={() => handleCartBuy(shopName)}
                                />
                            </div>
                        </div>

                        {/* Product List */}
                        {itemsInShop.map((item) => {
                            const { cart_type, totalItemQuantity } = item;
                            const product = cart_type === "cart" ? item : item?.product;
                            if (!product) return null;

                            const discountDetail =
                                cart_type === "group-cart" && item.level > 1
                                    ? product?.discount?.discount_Details?.find((detail) => detail.level === item.level)
                                    : null;

                            const discountPrice = discountDetail
                                ? sharedService.formatVietnamDong(product.price - product.price * discountDetail.amount)
                                : null;

                            const formattedPrice = sharedService.formatVietnamDong(product.price);
                            const formattedTotalPrice = sharedService.formatVietnamDong(totalItemQuantity * product.price);

                            return (
                                <div key={product.id} className="flex flex-wrap items-center gap-6 border-b pb-6 mb-6">
                                    {/* Product Image */}
                                    <div className="flex justify-center w-24 h-24">
                                        <Image
                                            className="rounded-lg object-cover"
                                            src={product.images?.[0] || "/placeholder.png"}
                                            alt={product.name}
                                            width={100}
                                            height={100}
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 space-y-2">
                                        <p className="font-semibold text-xl text-gray-800">{product.name}</p>
                                        <span className="text-sm text-gray-600">
                                            {formattedPrice} | Quantity: {totalItemQuantity}
                                        </span>
                                        <div className="mt-2">
                                            <p className="text-lg font-semibold text-gray-900">
                                                Total: {formattedTotalPrice}
                                            </p>
                                            {discountPrice && (
                                                <p className="text-lg font-semibold text-red-500">
                                                    Discount Price: {discountPrice}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
}
