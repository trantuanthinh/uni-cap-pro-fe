import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ children }) {
    const [rating, setRating] = useState(0);

    const handleClick = (value) => {
        setRating(value);
    };

    return (
        <>
            { [1, 2, 3, 4, 5].map((value) => (
                <span key={ value } onClick={ () => handleClick(value) } style={ { cursor: "pointer" } }>
                    <FaStar color={ value <= rating ? "gold" : "gray" } size={ 24 } />
                </span>
            )) }
        </>
    );
}
