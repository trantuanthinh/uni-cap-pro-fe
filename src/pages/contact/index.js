"use client";

import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import { toast } from "sonner";

export default function Contact() {
    const sendEmail = async () => {
        let message = {

        };

        await apiService
            .sendContact(message)
            .then((res) => {
                toast.success("Email sent successfully");
                console.log(res);
            })
            .catch((error) => {
                toast.error("Error sending email");
                console.log(error);
            });
    };
    return (
        <>
            <Title label={`${ GlobalSettings.Settings.name } - Contact`} />
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
                <form className="max-w-lg mx-auto" onSubmit={sendEmail}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                            placeholder="Your Email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green"
                            rows="5"
                            placeholder="Your Message"></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-primary-green text-white px-4 py-2 rounded-md hover:bg-primary-green-dark">
                        Send Message
                    </button>
                </form>
            </div>
        </>
    );
}
