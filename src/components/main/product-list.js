import LinkButton from "../shared/link-button";
import ListItem from "../shared/list-item";

export default function ProductList({ type, title, productList = null, orderList = null, pageSize = 16 }) {
    return (
        <>
            <p className="text-5xl font-bold text-text-title">{ title }</p>
            { productList && <ListItem type={ type } productList={ productList } pageSize={ pageSize } /> }

            { orderList && <ListItem type={ type } orderList={ orderList } pageSize={ pageSize } /> }
            <LinkButton href="/products/all" />
        </>
    );
}
