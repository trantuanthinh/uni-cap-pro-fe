import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import Providers from "@/redux/provider";
import "@/styles/globals.css";
import { Itim, Lusitana } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";

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
				<div className={ `flex flex-col min-h-screen ${itim.className}` }>
					<Header />
					<main className="flex-grow">
						<Component { ...pageProps } />
					</main>
					<Footer />
				</div>
			</NextUIProvider>
		</Providers>
	);
}
