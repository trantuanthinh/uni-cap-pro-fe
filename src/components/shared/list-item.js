import ItemCard from "./item-card";

export default function ListItem({ productList, pageSize, type }) {
    return (
        <div className="grid grid-cols-4 grid-flow-row">
            { Array.isArray(productList) &&
                productList
                    .slice(0, pageSize)
                    .map((product, index) => <ItemCard key={ `${product.id}-${index}` } id={ product.id } product={ product } type={ type } />) }
        </div>
    );
}
