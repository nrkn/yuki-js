"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const fs_1 = require("fs");
const esprima_1 = require("esprima");
const __1 = require("..");
const escodegen_1 = require("escodegen");
const kitchenSinkYuki = fs_1.readFileSync('./src/test/fixtures/kitchen-sink.yuki.js', 'utf8');
const kitchenSinkAst = esprima_1.parseScript(kitchenSinkYuki, { loc: true });
const bresenhamYuki = fs_1.readFileSync('./src/test/fixtures/bresenham.yuki.js', 'utf8');
const bresenhamAst = esprima_1.parseScript(bresenhamYuki, { loc: true });
describe('yuki-js', () => {
    it('compiles', () => {
        assert.doesNotThrow(() => __1.compile(kitchenSinkAst));
    });
    it('executes', () => {
        const expect = [
            10, 5, 11, 6, 12, 6, 13, 7, 14, 7, 15, 8, 16, 8, 17, 9, 18, 9, 19, 10, 20,
            10, 21, 11, 22, 11, 23, 12, 24, 12, 25, 13, 26, 13, 27, 14, 28, 14, 29,
            15, 30, 15, 31, 16, 32, 16, 33, 17, 34, 17, 35, 18, 36, 18, 37, 19
        ];
        const { program } = __1.compile(bresenhamAst);
        const source = escodegen_1.generate(program);
        const exec = Function(source + '; return line');
        const result = exec();
        const line = [];
        for (let i = 0; i < expect.length; i++) {
            line[i] = result[i];
        }
        assert.deepEqual(line, expect);
        assert.strictEqual(result[expect.length], 0);
    });
});
//# sourceMappingURL=index.js.map