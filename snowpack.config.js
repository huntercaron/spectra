module.exports = {
    // packageOptions: {
    //     source: "remote",
    //     types: true,
    // },
    optimize: {
        bundle: false,
        minify: false,
        target: "es2020",
    },
    mount: {
        public: { url: "/", static: true },
        src: { url: "/dist" },
    },
    plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-typescript"],
}
