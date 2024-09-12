import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function LinkButton({ label = "View More", href = "" }) {
    return (
        <Button
            as={ Link }
            href={ href }
            className="text-xl font-bold shadow-lg transition duration-300 w-60"
            color="success"
            radius="sm"
        >
            { label }
        </Button>
    );
}
