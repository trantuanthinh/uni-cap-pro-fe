import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ rating: initialRating }) {
    const [rating, setRating] = useState(initialRating ?? 0);

    const handleClick = (value) => {
        setRating(value);
    };

    return (
        <>
            {[1, 2, 3, 4, 5].map((value) => (
                <span key={value} onClick={() => handleClick(value)} style={{ cursor: "pointer" }}>
                    <FaStar color={value <= rating ? "gold" : "gray"} size={14} />
                </span>
            ))}
        </>
    );
}

