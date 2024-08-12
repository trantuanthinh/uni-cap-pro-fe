import { addToCart } from "@/redux/slicers/cartSlice";
import { useDispatch } from "react-redux";

export default function AddToCartButton({ item }) {
    const dispatch = useDispatch();

    function handleAddToCart() {
        dispatch(addToCart(item));
    };

    return (
        <button onClick={ handleAddToCart } className="text-lg text-white bg-red-500 p-2 rounded-lg">
            Add to cart
        </button>
    );
}
