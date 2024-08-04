import Link from "next/link";
import NavigationBar from "./navigation-bar";
import SignActions from "./sign-actions";
import UserActions from "./user-action";

export default function Header({ user }) {
    return (
        <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link href="/">Logo</Link>
                </div>
                <nav>
                    <NavigationBar />
                </nav>
                { user ? <UserActions user={ user } /> : <SignActions /> }
            </div>
        </header>
    );
}
