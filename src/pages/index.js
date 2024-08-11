import ProductList from "@/components/main/product-list";
import apiService from "@/services/api-service";
import { useEffect, useState } from "react";

export default function Home({ }) {
    const [items, setItems] = useState();

    useEffect(() => {
        getAllData();
    }, []);

    async function getAllData() {
        try {
            const response = await apiService.getProducts();
            setItems(response.data);
            console.log(response.data);
        } catch (error) {
            throw error;
        }
    }

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
    ];

    return (
        <main className="px-20 py-5">
            <section className="flex flex-col items-center justify-center ">
                <ProductList title={ "Productions" } listItems={ items } pageSize={ 8 } />
            </section>
            <section></section>
            <section></section>
            <section></section>
            <section></section>
        </main>
    );
}
