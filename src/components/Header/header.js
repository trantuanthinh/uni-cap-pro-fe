import { useEffect, useState } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Badge,
} from "@nextui-org/react";
import { useRouter } from "next/router";

export default function Header() {
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(Boolean(user));
    }, [user]);

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
                    <Link href="/cart">
                        <FaShoppingCart size={ 24 } className="text-white hover:text-gray-300" />
                        {/* <Badge
                                color="danger"
                                content={ cart.totalQuantity }
                                shape="circle"
                            >
                            </Badge> */}
                    </Link>
                </NavbarItem>

                { isMounted ? <UserActions user={ user } /> : <SignActions /> }
            </NavbarContent>
        </Navbar >
    );
}

const SignActions = () => {
    return (
        <>
            <NavbarItem>
                <Button as={ Link } color="primary" href="/sign-in" variant="flat">
                    Sign In
                </Button>
            </NavbarItem>
            <NavbarItem>
                <Button as={ Link } color="primary" href="/sign-up" variant="flat">
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
        { href: `/profile/${user?.username}`, label: "Profile" },
        { href: "/settings", label: "Settings" },
    ];

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(clearUser());
        router.push("/");
    }

    return (
        <>
            <NavbarItem>
                <div className="relative">
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
                </div>
            </NavbarItem>
        </>
    );
};
