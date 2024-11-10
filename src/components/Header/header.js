import { clearCart } from "@/redux/slicers/cartSlice";
import { clearGroupCart } from "@/redux/slicers/groupCartSlice";
import { clearUser } from "@/redux/slicers/userSlice";
import apiService from "@/services/api-service";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Image,
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
import { toast } from "sonner";

export default function Header() {
    const router = useRouter();
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    const [haveUser, setHaveUser] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setHaveUser(Boolean(user));
        const fetchCategories = async () => {
            try {
                const res = await apiService.getProd_Categories();
                setCategories(res.result.data);
            } catch (error) {
                console.log("Error: ", error.message);
                toast.error("Error: ", error.message);
            }
        };
        fetchCategories();
    }, [user]);

    function handleProductRouting(categoryId) {
        router.push({
            pathname: "/products",
            query: categoryId ? { CategoryId: categoryId } : "",
        });
    }

    const navList = [
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <Navbar shouldHideOnScroll className="shadow-md bg-emerald-600 text-white rounded-none">
            <NavbarBrand className="max-w-20">
                <Link href="/">
                    <Image className="size-14 rounded" src="/logo.png" alt="logo" layout="fixed" />
                </Link>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {navList.map((item) => (
                    <NavbarItem
                        key={item.href}
                        className="cursor-pointer text-black hover:underline"
                        onClick={() => router.push(item.href)}>
                        {item.label}
                    </NavbarItem>
                ))}
                <NavbarItem>
                    <Dropdown>
                        <DropdownTrigger className="cursor-pointer text-black hover:underline">Category</DropdownTrigger>
                        <DropdownMenu aria-label="Categories" color="primary" variant="flat">
                            <DropdownSection showDivider>
                                <DropdownItem key="all-product" onClick={() => handleProductRouting(null)}>
                                    All Products
                                </DropdownItem>
                                <DropdownItem key="shared-order" onClick={() => router.push("/shared-order")}>
                                    Shared Buy
                                </DropdownItem>
                            </DropdownSection>

                            <DropdownSection title="Categories">
                                {categories.map((category) => (
                                    <DropdownItem key={category.id} onClick={() => handleProductRouting(category.id)}>
                                        {category.name}
                                    </DropdownItem>
                                ))}
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} href="/cart" color="warning">
                        <FaShoppingCart size={24} className="text-white hover:text-gray-300" />
                    </Button>
                </NavbarItem>
                {haveUser ? <UserActions user={user} /> : <SignActions />}
            </NavbarContent>
        </Navbar>
    );
}

const SignActions = () => (
    <>
        <NavbarItem>
            <Button as={Link} href="/sign-in" color="primary" variant="solid">
                Sign In
            </Button>
        </NavbarItem>
        <NavbarItem>
            <Button as={Link} href="/sign-up" color="primary" variant="solid">
                Sign Up
            </Button>
        </NavbarItem>
    </>
);

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
        dispatch(clearCart());
        dispatch(clearGroupCart());
        router.push("/");
    };

    return (
        <>
            <NavbarItem>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" auto>
                            <FaUser />
                            <span className="ml-2">{user?.username}</span>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions">
                        {actionList.map(({ href, label }) => (
                            <DropdownItem key={label}>
                                <Link href={href} className="block px-4 py-2">
                                    {label}
                                </Link>
                            </DropdownItem>
                        ))}
                        <DropdownItem key="logout" color="danger">
                            <button onClick={handleLogout} className="w-full text-left">
                                Log out
                            </button>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarItem>
        </>
    );
};
