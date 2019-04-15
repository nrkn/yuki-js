"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_names_1 = require("../yuki-types/type-names");
exports.DefaultTransformOptions = () => ({
    external: {
        consts: ['$addressSize'],
        functions: [...type_names_1.typeNames, '$allocate', '$enter', '$exit', 'size']
    },
    scope: {
        type: 'global',
        consts: [],
        functions: [],
        numbers: [],
        arrays: []
    }
});
//# sourceMappingURL=default-options.js.map