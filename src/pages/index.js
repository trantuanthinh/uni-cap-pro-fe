import ProductList from "@/components/main/product-list";

export default function Home({ }) {
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
                <ProductList title={ "Productions" } listItems={ list } />
            </section>
            <section></section>
            <section></section>
            <section></section>
            <section></section>
        </main>
    );
}
