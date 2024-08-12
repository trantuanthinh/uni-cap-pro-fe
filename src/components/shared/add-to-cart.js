import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slicers/cartSlice";

export default function AddToCartButton({ item }) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart(item));
    };

    return (
        <button
            onClick={ handleAddToCart }
            className="text-lg text-white bg-red-500 p-2 rounded-lg"
        >
            Add to cart
        </button>
    );
}
