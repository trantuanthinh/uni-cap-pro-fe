import Link from "next/link";
import { useEffect, useState } from "react";
import LinkList from "../shared/link-list";
import SignActions from "./sign-actions";
import UserActions from "./user-action";

export default function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            console.log("storedUser", JSON.parse(storedUser));

            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
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
                { user ? <UserActions user={ user } /> : <SignActions /> }
            </div>
        </header>
    );
}
