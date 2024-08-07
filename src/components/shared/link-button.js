import Link from "next/link";

export default function LinkButton({ label = "View More", href = "" }) {
    return (
        <Link
            href={ href }
            className="px-8 py-2 mt-5 rounded-xl bg-red-500 text-white text-xl font-bold shadow-lg hover:bg-red-600 transition duration-300"
        >
            { label }
        </Link>
    );
}