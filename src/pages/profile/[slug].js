"use client";

import LinkButton from "@/components/shared/buttons/link-button";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import apiService from "@/services/api-service";
import sharedService from "@/services/sharedService";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Avatar = ({ avatar = null, username }) => (
    avatar ? (
        <Image className="rounded-full shadow-lg" src={ avatar } alt={ username } width={ 96 } height={ 96 } />
    ) : (
        <span className="text-gray-600 font-bold text-5xl">{ username?.charAt(0).toUpperCase() }</span>
    )
);

export default function ProfileLayout() {
    const user = useSelector((state) => state.user);
    const router = useRouter();
    const { slug } = router.query;

    const [ orders, setOrders ] = useState([]);
    const [ isMounted, setIsMounted ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        if (router.isReady && user) {
            setIsLoading(true);
            apiService
                .getUserOrders(user.id)
                .then((orderRes) => {
                    setOrders(orderRes.result);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log("Error: ", error);
                    toast.error(error.message || "Failed to fetch orders");
                    setIsLoading(false);
                });
        }
    }, [ router.isReady, slug, user ]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            <Title label={ `${ GlobalSettings.Settings.name } - ${ user?.username }` } />
            { isMounted && user ? (
                <div className="max-w-screen-lg mx-auto py-10 px-6">
                    <div className="flex items-center space-x-8 mb-10">
                        <div className="w-28 h-28 flex justify-center items-center rounded-full bg-gradient-to-r from-green-300 to-blue-500 shadow-md overflow-hidden">
                            <Avatar avatar={ user?.avatar } username={ user?.username } />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{ user?.username }</h1>
                            <p className="text-gray-500">Joined In: { sharedService.formatDate(user?.created_At) }</p>
                        </div>
                    </div>

                    <div className="mb-8 border-b border-gray-200 pb-4">
                        <Tabs aria-label="Profile Options" radius="md" color="primary" variant="underline">
                            <Tab key="Overview" title="Overview">
                                <Card className="bg-white shadow-lg rounded-lg">
                                    <CardBody>
                                        <p className="text-gray-700">Gmail: { user?.email }</p>
                                        <p className="text-gray-700">Phone Number: { user?.phoneNumber }</p>
                                        <p className="text-gray-700">Description: { user?.description }</p>
                                        <p className="text-gray-700">Type: { user?.user_Type }</p>
                                    </CardBody>
                                </Card>
                            </Tab>

                            <Tab key="OrderContent" title="Orders">
                                <Card className="bg-white shadow-lg rounded-lg">
                                    <CardBody>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
                                            { isLoading ? (
                                                <div className="flex justify-center py-4">
                                                    <p className="text-gray-600">Loading...</p>
                                                </div>
                                            ) : (
                                                orders.length > 0 ? (
                                                    orders.map((order) => (
                                                        <div
                                                            key={ order.id }
                                                            className="mb-6 flex flex-row items-center space-x-4">
                                                            <Image
                                                                className="rounded-lg shadow-md"
                                                                src={ order.product.images[ 0 ] }
                                                                alt={ order.product.name }
                                                                width={ 100 }
                                                                height={ 100 }
                                                            />
                                                            <div className="flex flex-col space-y-1">
                                                                <p className="font-semibold text-gray-900">{ order.name }</p>
                                                                <p className="text-gray-600">Product: { order.product.name }</p>
                                                                <p className="text-gray-600">Quantity: { order.quantity }</p>
                                                                <p className="text-gray-600">Unit Price: { order.price }</p>
                                                                <p className="text-gray-600">
                                                                    Total:{ " " }
                                                                    { sharedService.formatVietnamDong(
                                                                        order.price * order.quantity
                                                                    ) }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex justify-center py-4">
                                                        <p className="text-gray-500">You don't have any orders yet.</p>
                                                    </div>
                                                )
                                            ) }
                                            <LinkButton
                                                href="/"
                                                label="Go to Home"
                                                className="mt-4 text-green-600 hover:text-green-800 transition-all"
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>

                            <Tab key="ManageProduct" title="Manage Products">
                                <Card className="bg-white shadow-lg rounded-lg">
                                    <CardBody>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
                                            { isLoading ? (
                                                <div className="flex justify-center py-4">
                                                    <p className="text-gray-600">Loading...</p>
                                                </div>
                                            ) : (
                                                orders.length > 0 ? (
                                                    orders.map((order) => (
                                                        <div
                                                            key={ order.id }
                                                            className="mb-6 flex flex-row items-center space-x-4">
                                                            <Image
                                                                className="rounded-lg shadow-md"
                                                                src={ order.product.images[ 0 ] }
                                                                alt={ order.product.name }
                                                                width={ 100 }
                                                                height={ 100 }
                                                            />
                                                            <div className="flex flex-col space-y-1">
                                                                <p className="font-semibold text-gray-900">{ order.name }</p>
                                                                <p className="text-gray-600">Product: { order.product.name }</p>
                                                                <p className="text-gray-600">Quantity: { order.quantity }</p>
                                                                <p className="text-gray-600">Unit Price: { order.price }</p>
                                                                <p className="text-gray-600">
                                                                    Total:{ " " }
                                                                    { sharedService.formatVietnamDong(
                                                                        order.price * order.quantity
                                                                    ) }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex justify-center py-4">
                                                        <p className="text-gray-500">You don't have any orders yet.</p>
                                                    </div>
                                                )
                                            ) }
                                            <LinkButton
                                                href="/"
                                                label="Go to Home"
                                                className="mt-4 text-green-600 hover:text-green-800 transition-all"
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>

                        </Tabs>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center py-10">
                    <p className="text-gray-600">Loading...</p>
                </div>
            ) }
        </>
    );
};


