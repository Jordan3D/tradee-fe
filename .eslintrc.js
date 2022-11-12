module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "jest": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-hooks",
        "jest",
        "@typescript-eslint"
    ],
    "rules": {
        "no-use-before-define": "off",
        "react/jsx-filename-extension": ["warn", { "extensions": [".tsx"] }],
        "no-constant-condition": "off",
        "import/prefer-default-export": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
    }
}
