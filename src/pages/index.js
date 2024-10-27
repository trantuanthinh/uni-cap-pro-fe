import ProductList from "@/components/main/product-list";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home({ }) {
    const page = 1;
    const pageSize = 12;
    const [productList, setProductList] = useState([]);
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    function getData() {
        let filterProduct = { SortBy: "total_Rating_Value", SortOrder: "desc", Page: page, PageSize: pageSize };
        let filterOrder = {
            Filter: "isShare=true && isPaid=false",
            page: page,
            pageSize: pageSize,
        };
        Promise.all([apiService.getProducts(filterProduct), apiService.getOrders(filterOrder)])
            .then(([productRes, orderRes]) => {
                setProductList(productRes.result.data);
                setOrderList(orderRes.result.data);
            })
            .catch((error) => {
                console.log("Error: ", error.message);
                toast.error("Error: ", error.message);
            });
    }

    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Home`} />
            <main className="grid grid-flow-row gap-y-2">
                <section className="bg-[#F5F5DC] py-10">
                    <div className="container mx-auto px-4 md:px-0">
                        <div className="flex flex-col md:flex-row items-center justify-center">
                            <div className="w-full md:w-1/2 flex flex-col items-center justify-center md:pl-10">
                                <h2 className="text-3xl font-bold">Welcome to {GlobalSettings.Settings.name}</h2>
                                <p className="text-lg">Shop with us and enjoy the best shopping experience</p>
                                <Button auto className="mt-6" size="lg">
                                    Explore Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col items-center justify-center">
                    <ProductList title={"Productions"} list={productList} pageSize={pageSize} type={"product"} />
                </section>

                <section className="flex flex-col items-center justify-center">
                    <ProductList title={"Buy Together"} list={orderList} pageSize={pageSize} type={"shared-product"} />
                </section>
                <section></section>
            </main>
        </>
    );
}
