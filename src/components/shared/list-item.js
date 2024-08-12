import sharedService from "@/services/sharedService";
import ItemBlock from "./item-block";

export default function ListItem({ productList, pageSize }) {
    return (
        <div className="grid grid-cols-4 grid-flow-row">
            { productList &&
                productList.slice(0, pageSize).map((product) => {
                    return (
                        <ItemBlock
                            key={ product.id }
                            id={ product.id }
                            product={ product }
                        />
                    );
                }) }
        </div>
    );
}
