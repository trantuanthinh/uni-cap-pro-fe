import ProductList from "@/components/main/product-list";
import apiService from "@/services/api-service";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home({ }) {
    const [productList, setProductList] = useState([]);
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    function getData() {
        Promise.all([apiService.getProducts(), apiService.getOrders()])
            .then(([productResponse, orderResponse]) => {
                setProductList(productResponse.data);
                setOrderList(orderResponse.data);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
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
        },
    ];

    return (
        <>
            <Head>
                <title>Home Page</title>
                <meta name="description" content="Welcome to the home page of my website." />
            </Head>
            <main className="grid grid-flow-row gap-y-20 px-20 py-5">
                <section className="flex flex-col items-center justify-center">
                    <ProductList type={ "cart" } title={ "Productions" } productList={ productList } pageSize={ 8 } />
                </section>

                <section className="flex flex-col items-center justify-center">
                    <ProductList type={ "buy-together" } title={ "Buy Together" } orderList={ orderList } pageSize={ 8 } />
                </section>
                <section>
                    {/* <ProductList type={ "buy-together" } title={ "Buy Together" } productList={ orderList } pageSize={ 8 } /> */ }
                </section>
                <section></section>
                <section></section>
            </main>
        </>
    );
}
