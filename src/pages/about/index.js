"use client";

import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import Image from "next/image";
import Link from "next/link";

export default function About() {
    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - About Us`} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
                <p className="text-lg leading-relaxed mb-6 text-center">
                    Welcome to our company! We are dedicated to providing the best services to our customers.
                    Our team of experts works hard to meet your needs and exceed your expectations.
                </p>

                <div className="flex justify-center mb-6">
                    <Image
                        src="/logo/background.jpg"
                        alt="About Us"
                        width={700}
                        height={500}
                        className="rounded-lg"
                    />
                </div>

                <div className="text-center mb-8">
                    <p className="text-lg leading-relaxed mb-4">
                        Our mission is to deliver high-quality products and services that create value for our clients. We are
                        passionate about what we do and are constantly striving to improve and innovate.
                    </p>
                    <p className="text-lg leading-relaxed mb-4">
                        We believe in transparency, collaboration, and continuous improvement. Our goal is to build long-term
                        relationships with our customers and contribute to their success.
                    </p>
                </div>

                <div className="bg-gray-100 p-8 rounded-lg mb-8">
                    <h2 className="text-3xl font-semibold text-center mb-6">Our Mission & Core Values</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        Our mission is to help businesses thrive by providing innovative and customized solutions. We value integrity,
                        accountability, and excellence in everything we do.
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li className="text-lg">Integrity: We act with honesty and fairness in all our dealings.</li>
                        <li className="text-lg">Customer-Centric: We place our clients at the center of everything we do.</li>
                        <li className="text-lg">Excellence: We continually strive to improve and deliver high-quality results.</li>
                        <li className="text-lg">Innovation: We embrace change and constantly look for ways to improve and adapt.</li>
                    </ul>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold mb-6">Meet Our Team</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        Our team is made up of dedicated professionals who bring expertise, creativity, and passion to the table.
                        We work collaboratively to achieve our goals and always keep the needs of our clients in mind.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <Image
                                src="/team/member1.jpg"
                                alt="Team Member"
                                width={150}
                                height={150}
                                className="rounded-full mx-auto mb-4"
                            />
                            <h3 className="text-xl font-semibold">John Doe</h3>
                            <p className="text-gray-500">CEO & Founder</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <Image
                                src="/team/member2.jpg"
                                alt="Team Member"
                                width={150}
                                height={150}
                                className="rounded-full mx-auto mb-4"
                            />
                            <h3 className="text-xl font-semibold">Jane Smith</h3>
                            <p className="text-gray-500">Marketing Director</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <Image
                                src="/team/member3.jpg"
                                alt="Team Member"
                                width={150}
                                height={150}
                                className="rounded-full mx-auto mb-4"
                            />
                            <h3 className="text-xl font-semibold">Michael Lee</h3>
                            <p className="text-gray-500">Lead Developer</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 p-8 rounded-lg mb-8">
                    <h2 className="text-3xl font-semibold text-center mb-6">Our Achievements</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        Over the years, we have achieved significant milestones that reflect our commitment to excellence and customer satisfaction.
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li className="text-lg">Awarded 'Best Company of the Year' in 2023</li>
                        <li className="text-lg">Successfully completed 500+ projects for clients worldwide</li>
                        <li className="text-lg">Ranked as a top performer in industry innovation</li>
                    </ul>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-semibold mb-4">Join Us Today!</h2>
                    <p className="text-lg leading-relaxed mb-6">
                        Whether you're looking for innovative solutions or seeking to work with a passionate team, we are here to help.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </>
    );
}
