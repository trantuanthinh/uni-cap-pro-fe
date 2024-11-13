import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import Providers from "@/redux/provider";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Itim, Lusitana, Noto_Sans, Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { Toaster } from "sonner";

export const lusitana = Lusitana({
    weight: ["400", "700"],
    subsets: ["latin"],
});

export const itim = Itim({
    weight: ["400"],
    subsets: ["latin"],
});

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
});

const notoSans = Noto_Sans({
    weight: '400',
    subsets: ['latin'],
});

export default function App({ Component, pageProps }) {
    const [showButton, setShowButton] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <Providers>
            <NextUIProvider>
                <div className={`grid grid-rows-[auto_1fr_auto] min-h-screen ${ notoSans.className }`}>
                    <Header />
                    {showButton && (
                        <div className="fixed bottom-4 right-4 z-10">
                            <button onClick={scrollToTop} className="bg-sky-500/60 size-8 flex items-center justify-center hover:bg-sky-500 text-white rounded-full p-2">
                                <FaChevronUp size={24} />
                            </button>
                        </div>
                    )}
                    <main>
                        <Toaster position="bottom-left" duration={2000} closeButton richColors />
                        <Component {...pageProps} />
                    </main>
                    <Footer />
                </div>
            </NextUIProvider>
        </Providers>
    );
}
