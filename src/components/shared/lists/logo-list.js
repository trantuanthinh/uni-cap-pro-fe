import Link from "next/link";

export default function LogoList({ logoList }) {
    return (
        <div className="flex space-x-4">
            { logoList && logoList?.map((item) => (
                <Link
                    key={ item.href }
                    href={ item.href }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400"
                    passHref
                >
                    { item.logo }
                </Link>
            )) }
        </div>
    );
}
