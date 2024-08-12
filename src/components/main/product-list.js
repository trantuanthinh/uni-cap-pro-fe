import LinkButton from "../shared/link-button";
import ListItem from "../shared/list-item";

export default function ProductList({ type, title, productList, pageSize = 16 }) {
    return (
        <>
            <p className="text-5xl font-bold text-text-title">{ title }</p>
            <ListItem type={ type } productList={ productList } pageSize={ pageSize } />
            <LinkButton href="/products/all" />
        </>
    );
}
