import ListItem from "@/components/shared/list-item";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Products({ children }) {
    const router = useRouter();
    const { slug } = router.query;
    const list = [
        {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        },
        {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        },
        {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        },
        {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        }, {
            title: "Title",
            description: "Description",
            imageUrl: "/download.jpg",
            price: 5000,
        },
    ];
    useEffect(() => {
        if (slug === "all") {

        }
    });

    function getAllProducts() {

    }

    return (
        <>
            <div className="flex flex-col items-center justify-center ">
                <h1>asdkjh</h1>
                <ListItem listItems={ list } />
            </div>
        </>
    );
}