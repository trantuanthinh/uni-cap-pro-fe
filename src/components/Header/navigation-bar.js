import Link from "next/link";

export default function NavigationBar({ children }) {
    const navList = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/produce", label: "Produce" },
    ];

    return (
        <ul className="flex space-x-6">
            { navList.map((item) => (
                <li key={ item.label }>
                    <Link href={ item.href } className="hover:underline">
                        { item.label }
                    </Link>
                </li>
            )) }
        </ul>
    );
}