export default {
    files : [
        "tests.ava/**/*.test.js",
        "tests.ava/**/*.test.cjs",
        "tests.ava/**/*.test.mjs",
        "tests.ava/**/*.test.ts"
    ],
    environmentVariables : {
        "MY_ENVIRONMENT_VARIABLE": "some value"
    },
    ignoredByWatcher : [
        "**/graph/typeDefs"
    ],
    require : [],
    nodeArguments : ["--es-module-specifier-resolution=node"]
}