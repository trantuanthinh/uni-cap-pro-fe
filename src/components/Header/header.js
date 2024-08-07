import Link from "next/link";
import LinkList from "../shared/link-list";
import SignActions from "./sign-actions";
import UserActions from "./user-action";

export default function Header({ user }) {
    const navList = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/produce", label: "Produce" },
    ];
    return (
        <header className="bg-primary-green text-white py-4 rounded-none">
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
