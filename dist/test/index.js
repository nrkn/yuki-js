"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const assert = require("assert");
const esprima_1 = require("esprima");
const __1 = require("..");
const bresenham_1 = require("../examples/bresenham");
const escodegen_1 = require("escodegen");
const split_source_1 = require("../split-source");
const kitchenSinkJs = fs_1.readFileSync('./src/test/fixtures/kitchen-sink.yuki.js', 'utf8');
const kitchenSinkAst = esprima_1.parseModule(kitchenSinkJs);
describe('yuki-js', () => {
    it('compiles', () => {
        const { main } = __1.compile(kitchenSinkAst);
        const source = escodegen_1.generate(main);
        assert(main);
        assert(source);
    });
    it('executes', () => {
        const expect = [
            10, 5, 11, 6, 12, 6, 13, 7, 14, 7, 15, 8, 16, 8, 17, 9, 18, 9, 19, 10, 20,
            10, 21, 11, 22, 11, 23, 12, 24, 12, 25, 13, 26, 13, 27, 14, 28, 14, 29,
            15, 30, 15, 31, 16, 32, 16, 33, 17, 34, 17, 35, 18, 36, 18, 37, 19
        ];
        const lib = esprima_1.parseScript(`
      function log(){}
    `);
        const options = {
            lib
        };
        const { main } = __1.compile(bresenham_1.bresenhamYuki, options);
        const bresenhamOut = escodegen_1.generate(main);
        const exec = Function(bresenhamOut + '; return $');
        const $ = exec();
        const values = [];
        for (let i = 0; i < $.lineIndex; i++) {
            values.push($.line[i]);
        }
        assert.deepEqual(values, expect);
    });
    describe('splitSource', () => {
        it('Unexpected VariableDeclaration', () => {
            const ast = esprima_1.parseScript(`
let x = Uint8
x = 0
let y = Uint8
      `.trim(), { loc: true });
            assert.throws(() => split_source_1.splitSource(ast), {
                message: 'Unexpected VariableDeclaration at line 3, column 0'
            });
        });
    });
});
//# sourceMappingURL=index.js.map