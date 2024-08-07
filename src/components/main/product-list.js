import Link from "next/link";
import ListItem from "../shared/list-item";

export default function ProductList({ title, listItems }) {
    return (
        <>
            <p className="text-5xl font-bold text-text-title">{ title }</p>
            <ListItem listItems={ listItems } />
            <Link
                href={ "/products/all" }
                className="px-8 py-2 mt-5 rounded-xl bg-red-500 text-white text-xl font-bold shadow-lg hover:bg-red-600 transition duration-300"
            >
                View More
            </Link>
        </>
    );
}
