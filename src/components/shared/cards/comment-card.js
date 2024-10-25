import sharedService from "@/services/sharedService";
import Image from "next/image";
import StarRating from "../star-rating";

// CommentCard Component
export default function CommentCard({ avatar = null, username, comment, rating, timestamp }) {
    timestamp = sharedService.formatToDate(timestamp);
    return (
        <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-4 mb-4 flex flex-col">
            <div className="flex items-center mb-2">
                <Avatar avatar={avatar} username={username} />
                <div className="flex-1 flex justify-between items-center ml-3">
                    <div className="flex items-center">
                        <h3 className="text-gray-900 font-semibold pr-2">{username}</h3>
                        <StarRating rating={rating} isChanged={false} />
                    </div>
                    <p className="text-gray-500 text-sm">{timestamp}</p>
                </div>
            </div>
            <p className="text-gray-800 break-words">{comment}</p>
        </div>
    );
}
// Avatar Component
const Avatar = ({ avatar, username }) => {
    if (avatar) {
        return <Image className="rounded-full" src={avatar} alt={username} width={40} height={40} />;
    } else {
        return (
            <div className="bg-gray-200 rounded-full size-10 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-lg">{username.charAt(0).toUpperCase()}</span>
            </div>
        );
    }
};
