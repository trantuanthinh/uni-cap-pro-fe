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

export default function ProfileLayout() {
    const user = useSelector((state) => state.user);
    const router = useRouter();
    const { slug } = router.query;

    const [ pageSize, setPageSize ] = useState(10);
    const [ totalPages, setTotalPages ] = useState(0);
    const [ isMounted, setIsMounted ] = useState(false);
    const [ orders, setOrders ] = useState([]);

    useEffect(() => {
        if (router.isReady && user) {
            apiService
                .getUserOrders(user.id)
                .then((orderRes) => {
                    const { data, pageSize, totalRecords } = orderRes.result;
                    setOrders(data);
                    setPageSize(pageSize);
                    setTotalPages(Math.ceil(totalRecords / pageSize));
                })
                .catch((error) => {
                    console.log("Error: ", error);
                    toast.error(error.message || "Failed to fetch orders");
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
                <div className="max-w-screen-lg mx-auto py-6">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-24 h-24 flex justify-center items-center rounded-full bg-gray-200 overflow-hidden">
                            <Avatar avatar={ user?.avatar } username={ user?.username } />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">{ user?.username }</h1>
                            <p className="text-gray-600">{ user?.email }</p>
                            <p className="text-gray-500">
                                Joined: { sharedService.formatDate(user?.created_At) }
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 border-b">
                        <Tabs aria-label="Profile Options" radius="md" color="success">
                            <Tab key="Overview" title="Overview">
                                <Card>
                                    <CardBody>
                                        <p>Overview</p>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="OrderContent" title="Orders">
                                <Card>
                                    <CardBody>
                                        <div>
                                            <h2 className="text-xl font-semibold">Your Orders</h2>
                                            { orders.length > 0 ? (
                                                orders.map((order) => (
                                                    <div key={ order.id } className="mb-4">
                                                        <p className="font-semibold">{ order.name }</p>

                                                        <p className="text-gray-500">
                                                            Product: { order.product.name }
                                                        </p>

                                                        <p className="text-gray-500">
                                                            Product: { order.sub_Orders.quantity }
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>
                                                    <p className="text-gray-500">You don't have any orders yet.</p>
                                                    <LinkButton href="/" label="Go to Home" />
                                                </div>
                                            ) }
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
}

const Avatar = ({ avatar = null, username }) => {
    return avatar ? (
        <Image className="rounded-full" src={ avatar } alt={ username } width={ 96 } height={ 96 } />
    ) : (
        <span className="text-gray-600 font-bold text-5xl">
            { username?.charAt(0).toUpperCase() }
        </span>
    );
};
