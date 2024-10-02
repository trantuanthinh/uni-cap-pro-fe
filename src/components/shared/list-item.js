import ItemCard from "./cards/item-card";
import SharedItemCard from "./cards/shared-item-card";

export default function ListItem({ list = null, pageSize = 16, type = "product" }) {
    return (
        <div className="grid grid-cols-4 grid-flow-row">
            { type === "product" &&
                list &&
                list.slice(0, pageSize).map((product) => <ItemCard key={ product.id } id={ product.id } product={ product } />) }

            { type === "shared-product" &&
                list &&
                list
                    .slice(0, pageSize)
                    .map((order) => (
                        <SharedItemCard key={ order.id } id={ order.product.id } level={ order.level } product={ order.product } />
                    )) }
        </div>
    );
}
