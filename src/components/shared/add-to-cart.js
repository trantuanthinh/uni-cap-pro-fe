export default function AddToCartButton({ onClick }) {
    console.log(onClick);
    return (
        <button onClick={ onClick } className="text-lg text-white bg-red-500 p-2">
            Add to cart
        </button>
    );
}