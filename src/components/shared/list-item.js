import ItemCard from "./item-card";

export default function ListItem({ productList = null, orderList = null, pageSize, type }) {
    return (
        <div className="grid grid-cols-4 grid-flow-row">
            { productList &&
                productList
                    .slice(0, pageSize)
                    .map((product, index) => (
                        <ItemCard key={ `${product.id}-${index}` } id={ product.id } product={ product } type={ type } />
                    )) }

            { orderList &&
                orderList
                    .slice(0, pageSize)
                    .map((order, index) => (
                        <ItemCard
                            key={ `${order.id}-${index}` }
                            level={ order.level }
                            id={ order.product.id }
                            product={ order.product }
                            type={ type }
                        />
                    )) }
        </div>
    );
}
