import sharedService from "@/services/sharedService";
import ItemBlock from "./item-block";

export default function ListItem({ listItems, pageSize = 16 }) {
    return (
        <div className="flex flex-row flex-wrap items-center justify-center">
            {listItems &&
                listItems.slice(0, pageSize).map((item) => {
                    const formattedPrice = sharedService.formatVietnamDong(item.price);
                    return (
                        <ItemBlock
                            id={item.description}
                            title={item.title}
                            description={item.description}
                            imageUrl={item.imageUrl}
                            price={formattedPrice}
                        />
                    );
                })}
        </div>
    );
}
