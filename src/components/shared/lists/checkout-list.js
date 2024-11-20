import sharedService from "@/services/sharedService";
import { Image } from "@nextui-org/react";

export default function CheckoutList({ items = [] }) {
    return (
        <>
            {items &&
                items?.map((item) => {
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
                    // const totalPrice;

                    return (
                        <div key={product.id} className="grid grid-cols-[100px_1fr_auto] items-center gap-4 border-b pb-4">
                            {/* Product Image */}
                            <div className="flex justify-center">
                                <Image
                                    className="rounded-lg object-cover"
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* Product Details */}
                            <div className="space-y-1">
                                <p className="font-bold text-xl">{product.name}</p>
                                <span className="text-red-500">
                                    {formattedPrice} | Quantity: {totalItemQuantity}
                                </span>
                                <div>
                                    <p className="text-lg font-semibold">Total Price: {formattedTotalPrice}</p>
                                    {discountPrice && (
                                        <p className="text-lg font-semibold">Discount Price: {discountPrice}</p>
                                    )}
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="flex flex-col items-end">
                                {/* <p className="text-lg font-semibold">Total Price: {sharedService.formatVietnamDong(totalPrice)}</p> */}
                            </div>
                        </div>
                    );
                })}
        </>
    );
}
