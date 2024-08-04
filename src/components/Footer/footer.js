import LinkList from '../shared/link-list';

export default function Footer() {
    const linkList = [
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/privacy", label: "Privacy Policy" },
    ];

    return (
        <footer className="bg-primary-green text-white py-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <LinkList linkList={ linkList } />
                </div>

                {/* Social Media Links */ }
                <div className="flex space-x-4 mb-4 md:mb-0"></div>

                {/* Copyright */ }
                <p className="text-sm">
                    &copy; { new Date().getFullYear() } Your Company. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
