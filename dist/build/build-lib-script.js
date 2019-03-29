"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const esprima_1 = require("esprima");
const libScript = fs_1.readFileSync('./dist/lib/index.js', 'utf8');
const ast = esprima_1.parseScript(libScript);
const json = JSON.stringify(ast, null, 2);
fs_1.writeFileSync('./src/lib-ast/lib.ast.json', json, 'utf8');
//# sourceMappingURL=build-lib-script.js.map