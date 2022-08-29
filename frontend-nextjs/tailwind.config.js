/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            sm: "500px",
            smmd: "678px",
            md: "768px",
            lg: "976px",
            xl: "1440px",
        },
        extend: {
            spacing: {
                128: "32rem",
                144: "36rem",
                "9/10": "90%",
                "95/100": "95%",
                "8/10": "80%",
                "vw-full": "100vw",
                500: "500px",
                "left-unset": "unset",
                200: "200px",
                250: "250px",
                300: "300px",
            },
            colors: {
                dark: "#202225",
                "light-dark": "#262B2F",
                "dark-sec": "#04111D",
                light: "#fff",
                "light-blur": "rgba(255, 255, 255, 0.5)",
                grey: "grey",
                lightgrey: "lightgrey",
                blue: "#2E8EEE",
                lightblue: "rgba(32, 129, 226, 0.5)",
                "lightest-black": "rgba(0,0,0,0.2)",
            },
        },
    },
    plugins: [],
}
