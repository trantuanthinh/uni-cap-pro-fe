"use client";

import Head from "next/head";
import Image from "next/image";

export default function About() {
    return (
        <>
            <Head>
                <title>About Us</title>
                <meta name="description" content="Learn more about us on this page." />
            </Head>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
                <p className="text-lg leading-relaxed mb-6 text-center">
                    Welcome to our company! We are dedicated to providing the best services to our customers.
                    Our team of experts works hard to meet your needs and exceed your expectations.
                </p>

                <div className="flex justify-center mb-6">
                    <Image
                        src="/images/about-us.jpg"
                        alt="About Us"
                        width={ 600 }
                        height={ 400 }
                        className="rounded-lg"
                    />
                </div>

                <div className="text-center">
                    <p className="text-lg leading-relaxed">
                        Our mission is to deliver high-quality products and services that create value for our clients. We are
                        passionate about what we do and are constantly striving to improve and innovate.
                    </p>
                </div>
            </div>
        </>
    );
}
