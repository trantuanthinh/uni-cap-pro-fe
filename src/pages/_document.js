import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    const user = null;
    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8" />
            </Head>
            <body className="antialiased">
                <Header user={ user } />
                <Main />
                <NextScript />
                <Footer />
            </body>
        </Html>
    );
}
