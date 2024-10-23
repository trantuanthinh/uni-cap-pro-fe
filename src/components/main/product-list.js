import LinkButton from "../shared/buttons/link-button";
import ListItem from "../shared/list-item";

export default function ProductList({ title, list = null, pageSize = 16, type }) {
    return (
        <>
            <p className="text-5xl font-bold text-text-title">{title}</p>
            {list && <ListItem list={list} pageSize={pageSize} type={type} />}
            {type === "product" && <LinkButton href="/products" />}
            {type === "shared-product" && <LinkButton href="/shared-products" />}
        </>
    );
}
