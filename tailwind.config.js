/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary-green": "#4A773C",
                "light-green": "#7D9A5F",
                "rich-brown": "#6F4F28",
                "light-brown": "#BFAE9F",
                "beige": "#F5F5DC",
                "sky-blue": "#87CEEB",
                "sunset-orange": "#FF6F00",
                "harvest-yellow": "#F4C542",
                "text-title": "#4A773C",
                "text-base": "#6F4F28",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
