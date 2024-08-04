import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

export default function UserActions({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    const actionList = [
        { href: "/profile", label: "Profile" },
        { href: "/settings", label: "Settings" },
        { href: "/logout", label: "Logout" },
    ];

    return (
        <div className="relative">
            <button
                onClick={ toggleDropdown }
                className="flex items-center space-x-2 bg-rich-brown hover:bg-gray-700 text-white py-2 px-4 rounded focus:outline-none"
            >
                <FaUser />
                <span className="not-sr-only">{ user?.username }</span>
            </button>
            { isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg">
                    <ul className="py-1">
                        { actionList.map((item) => (
                            <li key={ item.label }>
                                <Link href={ item.href } className="block px-4 py-2 hover:bg-gray-100">
                                    { item.label }
                                </Link>
                            </li>
                        )) }
                    </ul>
                </div>
            ) }
        </div>
    );
}
