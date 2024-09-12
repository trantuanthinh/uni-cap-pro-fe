import { Button } from "@nextui-org/react";

export default function ShareBuyButton({ item }) {
    function handleShareBuy() {
        console.log("buy together", item);
    }

    return (
        <Button onClick={ handleShareBuy } className="text-lg" color="secondary" radius="small">
            Buy Together
        </Button>
    );
}
