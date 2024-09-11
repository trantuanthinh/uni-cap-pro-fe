"use client";

import { useSelector } from "react-redux";
import Title from "@/components/shared/title";
import GlobalSettings from "@/configurations/global-settings";
import Image from "next/image";
import { useEffect, useState } from "react";
import sharedService from "@/services/sharedService";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

export default function ProfileLayout({ children }) {
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const tabList = [
        { title: "Overview", content: <OverviewContent /> },
        { title: "Orders", content: <OrdersContent /> },
        { title: "Cart", content: <CartContent /> },
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
                            { tabList.map((tab) => (
                                <Tab key={ tab.title } title={ tab.title }>
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
