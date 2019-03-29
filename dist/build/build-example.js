"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const esprima_1 = require("esprima");
const escodegen_1 = require("escodegen");
const __1 = require("..");
const gameYukiSource = fs_1.readFileSync('./example/src/game.yuki.js', 'utf8');
const gameLibSource = fs_1.readFileSync('./example/src/lib.js', 'utf8');
const yukiAst = esprima_1.parseModule(gameYukiSource, { loc: true });
const libAst = esprima_1.parseScript(gameLibSource);
const { main, memoryUsed, programSize } = __1.compile(yukiAst, { lib: libAst });
const source = escodegen_1.generate(main);
fs_1.writeFileSync('./example/main.js', source, 'utf8');
console.log({ memoryUsed, programSize });
//# sourceMappingURL=build-example.js.map