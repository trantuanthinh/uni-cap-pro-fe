import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import Providers from "@/redux/provider";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Itim, Lusitana } from "next/font/google";
import { Toaster } from 'sonner';

export const lusitana = Lusitana({
    weight: ["400", "700"],
    subsets: ["latin"],
});

export const itim = Itim({
    weight: ["400"],
    subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
    return (
        <Providers>
            <NextUIProvider>
                <div className={ `grid grid-rows-[auto_1fr_auto] min-h-screen ${itim.className}` }>
                    <Header />
                    <main>
                        <Toaster position="bottom-center" duration={ 3000 } closeButton richColors />
                        <Component { ...pageProps } />
                    </main>
                    <Footer />
                </div>
            </NextUIProvider>
        </Providers>
    );
}
