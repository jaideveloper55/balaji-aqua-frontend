/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // ── Blue (Balaji Aqua) ──
    "bg-blue-500",
    "from-blue-500",
    "to-blue-600",
    "text-blue-500",
    "text-blue-600",
    "bg-blue-50",
    "hover:bg-blue-50",
    "hover:text-blue-600",
    "shadow-blue-500/25",
    "group-hover/item:text-blue-500",

    // ── Teal / Emerald (Royal Beverage) ──
    "bg-teal-500",
    "from-teal-500",
    "to-emerald-600",
    "text-teal-500",
    "text-teal-600",
    "bg-teal-50",
    "hover:bg-teal-50",
    "hover:text-teal-600",
    "shadow-teal-500/25",
    "group-hover/item:text-teal-500",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
