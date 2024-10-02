import ProductList from "@/components/main/product-list";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import { useEffect, useState } from "react";

export default function Home({ }) {
    const page = 1;
    const pageSize = 12;
    const [ productList, setProductList ] = useState([]);
    const [ orderList, setOrderList ] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    function getData() {
        let filterProduct = { page: page, pageSize: pageSize };
        let filterOrder = {
            Filter: "isShare=true && isPaid=false",
            page: page,
            pageSize: pageSize,
        };
        Promise.all([ apiService.getProducts(filterProduct), apiService.getOrders(filterOrder) ])
            .then(([ productRes, orderRes ]) => {
                setProductList(productRes.result.data);
                setOrderList(orderRes.result.data);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    }

    return (
        <>
            <Title label={ `${ GlobalSettings.Settings.name } - Home` } />
            <main className="grid grid-flow-row gap-y-2 px-20">
                <section className="flex flex-col items-center justify-center">
                    <ProductList title={ "Productions" } list={ productList } pageSize={ pageSize } type={ "product" } />
                </section>

                <section className="flex flex-col items-center justify-center">
                    <ProductList title={ "Buy Together" } list={ orderList } pageSize={ pageSize } type={ "shared-product" } />
                </section>
                <section></section>
                <section></section>
                <section></section>
            </main>
        </>
    );
}
