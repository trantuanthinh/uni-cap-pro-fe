import { useAppContext } from "@/contexts/AppContext";
import { clearCart } from "@/redux/slicers/cartSlice";
import { clearGroupCart } from "@/redux/slicers/groupCartSlice";
import { clearUser } from "@/redux/slicers/userSlice";
import apiService from "@/services/api-service";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Header() {
    const router = useRouter();
    const timeout = 2000;

    const user = useSelector((state) => state.user);
    const { mainCategories, updateMainCategories, updateCategories, categoryItems, updateCategoryItems } = useAppContext();
    const dispatch = useDispatch();

    const [openMainCategory, setOpenMainCategory] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);

    const handleMouseEnter = (menuId) => setOpenCategory(menuId);
    const handleMouseLeave = () => setOpenCategory(null);

    useEffect(() => {
        const fetchMainCategories = async () => {
            try {
                const res = await apiService.getProd_Main_Categories();
                let mainCategories = res.result.data;

                for (const item of mainCategories) {
                    const res2 = await apiService.getProd_Main_Category(item.id);
                    let categories = res2.result.categories;

                    updateCategoryItems((prev) => [
                        ...prev,
                        {
                            MainCategoryId: item.id,
                            Categories: categories,
                        },
                    ]);

                    updateCategories((prev) => [...prev, ...categories]);
                }

                updateMainCategories(mainCategories);
            } catch (error) {
                toast.error("Error: ", error.message);
                console.log("Error: ", error.message);
            }
        };

        fetchMainCategories();
    }, []);

    const getCategories = useMemo(() => {
        return categoryItems.find((item) => item.MainCategoryId === openCategory)?.Categories || [];
    }, [categoryItems, openCategory]);

    const handleProductRouting = (categoryId) => {
        router.push({
            pathname: "/products",
            query: categoryId ? { CategoryId: categoryId } : "",
        });
    };

    const navList = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <Navbar shouldHideOnScroll className="shadow-md bg-emerald-600 text-white rounded-none">
            <NavbarBrand className="max-w-20">
                <Link href="/">
                    <Image
                        className="size-14 rounded"
                        src="/logo/logo-white-removebg-preview.png"
                        alt="logo"
                        layout="fixed"
                    />
                </Link>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4">
                {navList.map((item) => (
                    <NavbarItem
                        key={item.href}
                        className="cursor-pointer text-black hover:underline"
                        onClick={() => router.push(item.href)}>
                        {item.label}
                    </NavbarItem>
                ))}

                <NavbarItem className="relative cursor-pointer text-black hover:underline space-y-5">
                    <span onMouseEnter={() => setOpenMainCategory(true)}>Categories</span>

                    {openMainCategory && (
                        <ul
                            className="absolute mt-2 bg-white border border-gray-300 shadow-lg rounded w-max"
                            onMouseLeave={() => setTimeout(() => setOpenMainCategory(false), timeout)}>
                            <li onClick={() => handleProductRouting("")}>
                                <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    All Products
                                </div>
                            </li>

                            <li onClick={() => handleProductRouting("shared-order")}>
                                <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    Shared-Order
                                </div>
                            </li>

                            <hr className="border-gray-500 w-[80%]" />

                            {mainCategories.map((mainCategory) => (
                                <li
                                    key={mainCategory.id}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(mainCategory.id)}
                                    onMouseLeave={handleMouseLeave}>
                                    <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        {mainCategory.name}{" "}
                                        <span>
                                            <IoIosArrowForward />
                                        </span>
                                    </div>

                                    {openCategory === mainCategory.id && (
                                        <ul className="absolute left-full top-0 bg-white border border-gray-300 shadow-lg rounded w-max">
                                            {getCategories.map((category) => (
                                                <li
                                                    key={category.id}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleProductRouting(category.id)}>
                                                    {category.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} href="/cart" color="warning">
                        <FaShoppingCart size={24} className="text-white hover:text-gray-300" />
                    </Button>
                </NavbarItem>
                {user ? <UserActions user={user} dispatch={dispatch} /> : <SignActions />}
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

const UserActions = ({ user, dispatch }) => {
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
        toast.success("Logged out successfully");
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
