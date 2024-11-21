import { OrderType } from "@/configurations/order-data-type";
import sharedService from "@/services/sharedService";
import { Button, Image } from "@nextui-org/react";

export default function CheckoutList({ user, items = [] }) {
    // Group items by shop name
    const groupedItems = items.reduce((acc, item) => {
        const shopName = item?.owner || "Unknown Shop";
        if (!acc[shopName]) {
            acc[shopName] = [];
        }
        acc[shopName].push(item);
        return acc;
    }, {});

    const handleBuy = (shopName) => {
        let dataJson = {
            itemRequests: groupedItems[shopName].map((item) => ({
                productId: item.id,
                quantity: item.totalItemQuantity,
            })),
            userId: user.id,
            districtId: user.districtId,
            isShare: groupedItems[shopName].some((item) => item.order_type === OrderType.shared_order),
        };
        console.log(dataJson);
    };

    return (
        <>
            {Object.keys(groupedItems).map((shopName) => {
                const type =
                    groupedItems[shopName][0]?.order_type === OrderType.shared_order ? "Shared Orders" : "Individual Orders";
                const itemsInShop = groupedItems[shopName];

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
                                    onClick={() => handleBuy(shopName)}>
                                    Buy
                                </Button>
                            </div>
                        </div>

                        {/* Product List */}
                        {itemsInShop.map((item) => {
                            const { cart_type, totalItemQuantity } = item;

                            // Determine product and calculate discount price if applicable
                            let product = cart_type === "cart" ? item : item?.product;
                            if (!product) return null;

                            let discountPrice = null;
                            if (cart_type === "group-cart" && item.level > 1) {
                                const discountDetail = product?.discount?.discount_Details?.find(
                                    (detail) => detail.level === item.level
                                );
                                if (discountDetail) {
                                    discountPrice = sharedService.formatVietnamDong(
                                        product.price - product.price * discountDetail.amount
                                    );
                                }
                            }

                            const formattedPrice = sharedService.formatVietnamDong(product.price);
                            const formattedTotalPrice = sharedService.formatVietnamDong(totalItemQuantity * product.price);

                            return (
                                <div key={product.id} className="flex flex-wrap items-center gap-6 border-b pb-6 mb-6">
                                    {/* Product Image */}
                                    <div className="flex justify-center w-24 h-24">
                                        <Image
                                            className="rounded-lg object-cover"
                                            src={product.images[0]}
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
