/** @type {import('tailwindcss').Config} */

import { nextui } from "@nextui-org/react";

module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                "background-base": "#059669",       // Nền chính: xanh lá đậm, tạo cảm giác tươi mới.
                "secondary-background": "#047857",  // Nền phụ: tối hơn một chút để tạo sự phân cấp.
                "text-base": "#FFFFFF",             // Màu chữ chính: trắng, tương phản cao và dễ đọc trên nền xanh lá.
                "text-secondary-base": "#B2DFDB",   // Màu chữ phụ: xanh ngọc nhạt, dịu mắt và hiện đại.
                "hover-dark": "#F7D977",            // Màu vàng nhạt hơn, tạo cảm giác dịu mắt.
                "hover-light": "#A08A62"            // Màu nâu sáng hơn, nhẹ nhàng và thân thiện.
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [nextui()],
};
