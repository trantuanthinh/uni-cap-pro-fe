export default function BuyTogetherButton({ item }) {
    function handleBuyTogether() {
        console.log("buy together", item);
    }

    return (
        <button onClick={ handleBuyTogether } className="text-lg text-white bg-red-500 p-2 rounded-lg">
            Buy Together
        </button>
    );
}
