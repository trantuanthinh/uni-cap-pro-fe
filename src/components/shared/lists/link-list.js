import Link from "next/link";

export default function LinkList({ linkList }) {
    return (
        <ul className="flex space-x-6">
            {linkList && linkList?.map((item) => (
                <li key={item.label}>
                    <Link href={item.href} className="hover:underline">
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
