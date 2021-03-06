{
    "plugins" : ["babel", "react"],
    "extends" : ["google", "plugin:react/recommended", "preact"],
    "rules" : {
        "no-undef" : "error",
        "semi" : ["warn", "never"],
        "object-curly-spacing" : ["off", "always"],
        "quotes" : "off",
        "key-spacing" : "off",
        "max-len" : ["warn", 120],
        "indent" : ["warn", 4, {
            "MemberExpression" : "off",
            "SwitchCase": 1,
            "ignoreComments" : true
        }],
        "prefer-const" : "warn",
        "linebreak-style" : ["error", "windows"],
        "comma-dangle" : "off",
        "eol-last" : "off",
        "padded-blocks" : "off",
        "no-trailing-spaces" : ["warn", { "skipBlankLines": true }],
        "arrow-parens" : ["off", "as-needed"],
        "camelcase": "warn",
        "operator-linebreak" : ["off", "before"],
        "no-multiple-empty-lines" : ["warn", { "max" : 3, "maxBOF" : 1, "maxEOF" : 3 }],
        "no-unused-vars" : "warn",
        "spaced-comment" : "off",
        "keyword-spacing": ["warn", { "overrides": {
            "catch": { "after": false }
        } }],
        "guard-for-in" : "off",
        "brace-style" : ["error", "1tbs", { "allowSingleLine": true }],
        "block-spacing" : ["error", "always"],
        "object-shorthand" : ["warn", "always"],
        "prefer-spread" : "warn",
        "space-before-function-paren" : ["warn", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
        "require-jsdoc" : "off",
        "new-cap" : "off",
        "curly" : "off",
        "no-const-assign" : "error",
        "rest-spread-spacing" : "off",
        "no-case-declarations" : "warn",
        "no-multi-spaces" : ["warn", { "exceptions": { 
            "VariableDeclarator": true,
            "ImportDeclaration": true 
        } }],
        "one-var" : "off",
        "prefer-arrow-callback" : "warn",

        "no-lonely-if" : "off",

        "no-invalid-this" : "off",
        "babel/no-invalid-this" : "warn",

        "react/prefer-stateless-function" : "off",
        "react/self-closing-comp" : "off"
    },
    "globals": {
        "global": "readonly",
        "Object": "readonly",
        "Array": "readonly",
        "module": "readonly",
        "require": "readonly",
        "process": "readonly",
        "console": "readonly",
        "__dirname": "readonly",
        "setTimeout": "readonly",
        "before": "readonly",
        "after": "readonly",
        "describe": "readonly",
        "it": "readonly",
        "expect": "readonly",
        
        "log": "readonly",
        "error": "readonly",
        "requestError": "readonly",
        "test": "readonly"
    },
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        },
        "babelOptions": { "rootMode": "upward-optional", "babelrcRoots": [".", "../.."] }
    },
    "env": {
        "es6": true
    },
    "ignorePatterns": [
      "build/"
    ]
}