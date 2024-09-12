"use client";

import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import sharedService from "@/services/sharedService";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ProfileLayout({ children }) {
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const tabs = [
        {
            id: "Overview",
            label: "Overview",
            content: <OverviewContent />,
        },
        {
            id: "Orders",
            label: "Orders",
            content: <OrdersContent />,
        },
        {
            id: "Cart",
            label: "Cart",
            content: <CartContent />,
        },
    ];

    return (
        <>
            <Title label={ `${GlobalSettings.Settings.name} - ${user?.username}` } />
            { isMounted && user && (
                <div className="max-w-screen-lg mx-auto py-6">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="size-24 justify-center items-center flex rounded-full bg-gray-200 overflow-hidden">
                            <Avatar avatar={ user?.avatar } username={ user?.username } />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">{ user?.username }</h1>
                            <p className="text-gray-600">{ user?.email }</p>
                            <p className="text-gray-500">Joined: { sharedService.formatDate(user?.created_At) }</p>
                        </div>
                    </div>

                    <div className="mb-6 border-b">
                        <Tabs aria-label="Options" radius="md" color="success">
                            { tabs.map((tab) => (
                                <Tab key={ tab.id } title={ tab.label }>
                                    <Card>
                                        <CardBody>{ tab.content }</CardBody>
                                    </Card>
                                </Tab>
                            )) }
                        </Tabs>
                    </div>

                    {/* Main Content */ }
                    { children }
                </div>
            ) }
        </>
    );
}

const Avatar = ({ avatar = null, username }) => {
    if (avatar) {
        return <Image className="rounded-full" src={ avatar } alt={ username } width={ 96 } height={ 96 } />;
    } else {
        return <span className="text-gray-600 font-bold text-5xl">{ username?.charAt(0).toUpperCase() }</span>;
    }
};

const OverviewContent = () => {
    return <p>Overview Content</p>;
};

const OrdersContent = () => {
    return <p>Orders Content</p>;
};

const CartContent = () => {
    return <p>Cart Content</p>;
};
