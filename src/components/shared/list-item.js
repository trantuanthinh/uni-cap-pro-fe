import sharedService from "@/services/sharedService";
import ItemCard from "./item-card";

export default function ListItem({ productList, pageSize }) {
    return (
        <div className="grid grid-cols-4 grid-flow-row">
            { productList &&
                productList.slice(0, pageSize).map((product) => {
                    return (
                        <ItemCard
                            key={ product.id }
                            id={ product.id }
                            product={ product }
                        />
                    );
                }) }
        </div>
    );
}
