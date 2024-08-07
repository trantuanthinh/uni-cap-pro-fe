import Image from "next/image";

export default function ItemBlock({ title, description, imageUrl, price }) {
    return (
        <>
            <div className="flex flex-col rounded-lg overflow-hidden shadow-xl p-4 m-5 bg-white transition-transform transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 cursor-pointer">
                <div className="flex-shrink-0 border-4 border-rich-brown rounded-lg mb-2">
                    <Image className="rounded" src={ imageUrl } alt={ title } width={ 240 } height={ 240 } />
                </div>

                <div className="px-6 py-2">
                    <p className="text-text-title font-bold text-2xl mb-2">{ title }</p>
                    <p className="text-text-base text-base">{ description }</p>
                    <p className="text-text-base text-base">{ price }</p>
                </div>
            </div>
        </>
    );
}
