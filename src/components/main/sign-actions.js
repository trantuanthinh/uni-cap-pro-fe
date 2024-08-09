import Link from "next/link";

export default function SignActions() {
    return (
        <div className="flex space-x-4">
            <Link href="/sign-in" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                Sign In
            </Link>
            <Link href="/sign-up" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                Sign Up
            </Link>
        </div>
    );
}
