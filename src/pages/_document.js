// pages/_document.js

import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    const user = null;

    return (
        <Html lang="en">
            <Head>
                <title>Capstone Project</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <body>
                <Header user={ user } />
                <Main />
                <NextScript />
                <Footer />
            </body>
        </Html>
    );
}
