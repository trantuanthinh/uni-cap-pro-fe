import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    // const user = {
    //     username: "trantuanthinh",
    //     age: 22,
    // };

    const user = null;

    return (
        <main className={ `${inter.className}` }>
            <Header user={ user } />

            <Footer />
        </main>
    );
}
