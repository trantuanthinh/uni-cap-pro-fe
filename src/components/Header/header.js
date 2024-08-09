import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SignActions from "../main/sign-actions";
import UserActions from "../main/user-action";
import LinkList from "../shared/link-list";

export default function Header() {
    const user = useSelector((state) => state.user);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const navList = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/produce", label: "Produce" },
    ];

    return (
        <header className="sticky top-0 z-50 shadow-md bg-primary-green text-white py-4 rounded-none">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link href="/">Logo</Link>
                </div>
                <nav>
                    <LinkList linkList={ navList } />
                </nav>
                { isClient && (user ? <UserActions user={ user } /> : <SignActions />) }
            </div>
        </header>
    );
}
