// pages/products/[slug].js

import AddToCartButton from '@/components/shared/add-to-cart';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProductDetail() {
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {

    });

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <Image
                        className="rounded-lg"
                        src="/download.jpg"
                        alt="Product Image"
                        width={ 500 }
                        height={ 500 }
                    />
                </div>
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-2">Product Title</h2>
                    <p className="text-gray-700 mb-4">Description of the product goes here. It can be a detailed description of the features, benefits, and other relevant information.</p>
                    <p className="text-xl font-semibold text-gray-900">Price: $99.99</p>

                    <AddToCartButton />
                </div>
            </div>
        </div>
    );
}
