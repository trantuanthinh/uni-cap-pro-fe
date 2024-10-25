import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ rating: initialRating, onDataChange, isChanged = false }) {
    const [rating, setRating] = useState(initialRating ?? 0);

    const handleClick = (value) => {
        setRating(value);
        if (onDataChange) {
            onDataChange(value);
        }
    };

    return (
        <div className="flex flex-row">
            {[1, 2, 3, 4, 5].map((value) => (
                <span
                    key={value}
                    onClick={isChanged ? () => handleClick(value) : null}
                    className={isChanged ? "cursor-pointer" : "cursor-default"}>
                    <FaStar color={value <= rating ? "gold" : "gray"} size={14} />
                </span>
            ))}
        </div>
    );
}
