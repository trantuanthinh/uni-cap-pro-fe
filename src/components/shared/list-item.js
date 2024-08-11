import sharedService from "@/services/sharedService";
import ItemBlock from "./item-block";

export default function ListItem({ listItems, pageSize }) {
    return (
        <div className="grid grid-cols-4 grid-flow-row">
            { listItems &&
                listItems.slice(0, pageSize).map((item) => {
                    return (
                        <ItemBlock
                            key={ item.id }
                            id={ item.id }
                            name={ item.name }
                            description={ item.description }
                            imageUrl={ item.imageUrl }
                            price={ item.price }
                        />
                    );
                }) }
        </div>
    );
}
