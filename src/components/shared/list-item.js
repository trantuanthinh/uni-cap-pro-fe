import AddToCartButton from "./buttons/add-to-cart-button";
import AddToGroupCartButton from "./buttons/add-to-group-cart";
import ItemCard from "./cards/item-card";
import SharedItemCard from "./cards/shared-item-card";

export default function ListItem({ list = null, pageSize = 16, type = "product" }) {
    return (
        <div className="grid grid-cols-2 w-full sm:grid-cols-3 md:grid-cols-4 gap-4">
            {type === "product" &&
                list &&
                list.slice(0, pageSize).map((product) => (
                    <div className="flex flex-col transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl bg-white shadow-lg rounded-lg">
                        <ItemCard key={product.id} product={product} />
                        <div className="flex items-center justify-center pb-2">
                            <AddToCartButton item={product} />
                        </div>
                    </div>
                ))}

            {type === "group-buy" &&
                list &&
                list.slice(0, pageSize).map((product) => (
                    <div className="flex flex-col transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl bg-white shadow-lg rounded-lg">
                        <ItemCard key={product.id} product={product} />
                        <div className="flex items-center justify-center pb-2">
                            <AddToGroupCartButton item={product} />
                        </div>
                    </div>
                ))}

            {type === "shared-product" &&
                list &&
                list.slice(0, pageSize).map((order) => <SharedItemCard key={order.id} order={order} />)}
        </div>
    );
}
