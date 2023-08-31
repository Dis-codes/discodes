/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				"discodes-purple": "#7976e7",
				"discodes-purple-light": "#918EF1"
			}
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["dark", "pastel", "winter", "dracula", "retro", "black", "luxury", "night", "business"],
	},
};

