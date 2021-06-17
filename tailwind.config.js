module.exports = {
    purge: [
        './index.html',
        './src/client/**/*.{vue,js,ts,jsx,tsx}',
        './src/apps/**/*.{vue,js,ts,jsx,tsx}'
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {}
    },
    variants: {
        extend: {}
    },
    plugins: []
}
