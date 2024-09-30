import { clearUser } from "@/redux/slicers/userSlice";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
    const router = useRouter();
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const [ haveUser, setHaveUser ] = useState(false);

    useEffect(() => {
        setHaveUser(Boolean(user));
    }, [ user ]);

    const navList = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/products/all", label: "Products" },
        { href: "/products/buy-together", label: "Buy Together" },
    ];

    return (
        <Navbar shouldHideOnScroll className="shadow-md bg-emerald-600 text-white rounded-none">
            <NavbarBrand>
                <Link href="/">Logo</Link>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                { navList.map((item) => (
                    <NavbarItem key={ item.href }>
                        <Link color="foreground" href={ item.href } underline="hover">
                            { item.label }
                        </Link>
                    </NavbarItem>
                )) }
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={ Link } href="/cart" color="warning">
                        <FaShoppingCart size={ 24 } className="text-white hover:text-gray-300" />
                    </Button>
                </NavbarItem>
                { haveUser ? <UserActions user={ user } /> : <SignActions /> }
            </NavbarContent>
        </Navbar>
    );
}

const SignActions = () => {
    return (
        <>
            <NavbarItem>
                <Button as={ Link } color="primary" href="/sign-in" variant="solid">
                    Sign In
                </Button>
            </NavbarItem>
            <NavbarItem>
                <Button as={ Link } color="primary" href="/sign-up" variant="solid">
                    Sign Up
                </Button>
            </NavbarItem>
        </>
    );
};

const UserActions = ({ user }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const actionList = [
        { href: `/profile/${ user?.username }`, label: "Profile" },
        { href: "/settings", label: "Settings" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(clearUser());
        router.push("/");
    };

    return (
        <>
            <NavbarItem>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" auto>
                            <FaUser />
                            <span className="ml-2">{ user?.username }</span>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions">
                        { actionList.map(({ href, label }) => (
                            <DropdownItem key={ label }>
                                <Link href={ href } className="block px-4 py-2">
                                    { label }
                                </Link>
                            </DropdownItem>
                        )) }
                        <DropdownItem key="logout" color="danger">
                            <button onClick={ handleLogout } className="w-full text-left">
                                Log out
                            </button>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarItem>
        </>
    );
};
