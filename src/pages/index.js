import ProductList from "@/components/main/product-list";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import { Button, Image } from "@nextui-org/react";
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
            Filter: "isShare=true",
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
                <section className="bg-[#F5F5DC] py-5 flex justify-center items-center">
                    <Banner />
                </section>

                <section className="flex flex-col items-center justify-center px-5">
                    <ProductList title={"Productions"} list={productList} pageSize={pageSize} type={"product"} />
                </section>

                {/* <section className="flex flex-col items-center justify-center">
                    {orderList.length == 0 ? (
                        ""
                    ) : (
                        <ProductList title={"Buy Together"} list={orderList} pageSize={pageSize} type={"shared-product"} />
                    )}
                </section> */}
                <section></section>
            </main>
        </>
    );
}

const Banner = () => {
    return (
        <>
            <div className="flex flex-col md:flex-row w-full max-w-screen-xl mx-auto rounded-lg overflow-hidden">
                {/* Left side image */}
                <div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
                    <Image src="/logo/background.jpg" alt="Background" layout="fill" className="rounded-l-lg" />
                </div>

                {/* Right side content */}
                <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-10  text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Welcome to {GlobalSettings.Settings.name}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 mt-4">
                        Shop with us and enjoy the best shopping experience.
                    </p>
                    <Button auto className="mt-6" size="lg" color="primary">
                        Explore Now
                    </Button>
                </div>
            </div>
        </>
    );
};
