import ItemCard from "./cards/item-card";
import SharedItemCard from "./cards/shared-item-card";

export default function ListItem({ list = null, pageSize = 16, type = "product" }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {type === "product" &&
                list &&
                list.slice(0, pageSize).map((product) => (
                    <ItemCard key={product.id} product={product} />
                ))}

            {type === "shared-product" &&
                list &&
                list.slice(0, pageSize).map((order) => (
                    <SharedItemCard key={order.id} order={order} />
                ))}
        </div>
    );
}
