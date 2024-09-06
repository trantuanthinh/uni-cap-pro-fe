import Head from "next/head";

export default function Title({ label = "" }) {
    return (
        <Head>
            <title>{ label }</title>
        </Head>
    );
}