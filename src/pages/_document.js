import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    // const user = {
    //     username: "trantuanthinh",
    //     age: 22,
    // };

    const user = null;
    return (
        <Html lang="en">
            <Head />
            <Header user={ user } />
            <body>
                <Main />
                <NextScript />
            </body>
            <Footer />
        </Html>
    );
}
