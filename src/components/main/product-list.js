import LinkButton from "../shared/link-button";
import ListItem from "../shared/list-item";

export default function ProductList({ title, listItems }) {
    return (
        <>
            <p className="text-5xl font-bold text-text-title">{ title }</p>
            <ListItem listItems={ listItems } pageSize={ 8 } />
            <LinkButton href = "/products/all" />
        </>
    );
}
