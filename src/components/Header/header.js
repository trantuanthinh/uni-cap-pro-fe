import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import SignActions from "../main/sign-actions";
import UserActions from "../main/user-action";
import LinkList from "../shared/link-list";

export default function Header() {
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(Boolean(user));
    }, [user]);

    const navList = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/products/all", label: "Products" },
        { href: "/products/buy-together", label: "Buy Together" },
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
                        <FaShoppingCart size={ 24 } className="text-white hover:text-gray-300" />
                    </Link>
                    {/* { cart.totalQuantity > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            { cart.totalQuantity }
                        </span>
                    ) } */}
                    { isClient ? <UserActions user={ user } /> : <SignActions /> }
                </div>
            </div>
        </header>
    );
}
