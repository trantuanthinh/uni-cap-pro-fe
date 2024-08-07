import sharedService from "@/services/sharedService";
import ItemBlock from "./item-block";

export default function ListItem({ listItems }) {
    return (
        <div className="flex flex-row flex-wrap items-center justify-center">
            {listItems &&
                listItems.map((item) => {
                    const formattedPrice = sharedService.formatVietnamDong(item.price);
                    return (
                        <ItemBlock
                            key={item.title}
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
