"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const esprima_1 = require("esprima");
const libScript = fs_1.readFileSync('./dist/lib/index.js', 'utf8');
exports.buildLib = (maxSize, addressSize) => {
    const callStackAst = esprima_1.parseScript(`
    const { $in, $out } = CallStack( ${maxSize}, ${addressSize} )
  `);
    const libAst = esprima_1.parseScript(libScript);
    const [useStrict, , ...rest] = libAst.body;
    libAst.body = [
        useStrict,
        ...rest,
        ...callStackAst.body
    ];
    return libAst.body;
};
//# sourceMappingURL=build-lib.js.map