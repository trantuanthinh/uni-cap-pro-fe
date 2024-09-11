import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" suppressHydrationWarning >
            <Head>
                <meta charSet="UTF-8" />
            </Head>
            <body className="antialiased" suppressHydrationWarning={true}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}