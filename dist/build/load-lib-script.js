"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const esprima_1 = require("esprima");
const libScript = fs_1.readFileSync('../../dist/lib/index.js', 'utf8');
exports.libScriptAst = () => esprima_1.parseScript(libScript);
//# sourceMappingURL=load-lib-script.js.map