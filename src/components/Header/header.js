import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SignActions from "../main/sign-actions";
import UserActions from "../main/user-action";
import LinkList from "../shared/link-list";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
    const user = useSelector((state) => state.user);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(Boolean(user));
    }, []);

    const navList = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/products", label: "Products" },
    ];

    return (
        <header className="sticky top-0 z-50 shadow-md bg-primary-green text-white py-4 rounded-none">
            <div className="grid grid-cols-3 mx-auto">
                <div className="flex items-center text-2xl font-bold px-10">
                    <Link href="/">Logo</Link>
                </div>
                <nav className="flex justify-center items-center text-xl">
                    <LinkList linkList={ navList } />
                </nav>
                <div className="flex justify-end items-center space-x-4 text-lg px-10">
                    <Link href="/cart">
                        <FaShoppingCart size={ 24 } />
                    </Link>
                    { isClient ? <UserActions user={ user } /> : <SignActions /> }
                </div>
            </div>
        </header>
    );
}
