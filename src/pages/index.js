import ProductList from "@/components/main/product-list";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import { useEffect, useState } from "react";

export default function Home({ }) {
    const [productList, setProductList] = useState([]);
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    function getData() {
        const filterOrder = { isShare: true, isPaid: true };
        Promise.all([apiService.getProducts(), apiService.getOrders()])
            .then(([productResponse, orderResponse]) => {
                setProductList(productResponse.result.data);
                setOrderList(orderResponse.result.data);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    }

    return (
        <>
            <Title label={`${GlobalSettings.Settings.name} - Home`} />
            <main className="grid grid-flow-row gap-y-2 px-20">
                <section className="flex flex-col items-center justify-center">
                    <ProductList type={"cart"} title={"Productions"} productList={productList} pageSize={8} />
                </section>

                <section className="flex flex-col items-center justify-center">
                    <ProductList type={"sharebuy"} title={"Buy Together"} orderList={orderList} pageSize={8} />
                </section>
                <section></section>
                <section></section>
                <section></section>
            </main>
        </>
    );
}
