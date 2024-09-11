'use client';

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
                        <nav className="flex space-x-4">
                            <div className="flex w-full flex-col">
                                <Tabs aria-label="Options" radius="md" color="success">
                                    <Tab key="photos" title="Photos">
                                        <Card>
                                            <CardBody>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            </CardBody>
                                        </Card>
                                    </Tab>
                                    <Tab key="music" title="Music">
                                        <Card>
                                            <CardBody>
                                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                            </CardBody>
                                        </Card>
                                    </Tab>
                                    <Tab key="videos" title="Videos">
                                        <Card>
                                            <CardBody>
                                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                            </CardBody>
                                        </Card>
                                    </Tab>
                                </Tabs>
                            </div>
                        </nav>
                    </div>

                    {/* Main Content */ }
                    { children }
                </div>
            ) }
        </>
    );
}

// Avatar Component
const Avatar = ({ avatar = null, username }) => {
    if (avatar) {
        return <Image className="rounded-full" src={ avatar } alt={ username } width={ 96 } height={ 96 } />;
    } else {
        return (
            <span className="text-gray-600 font-bold text-5xl">{ username?.charAt(0).toUpperCase() }</span>
        );
    }
};
