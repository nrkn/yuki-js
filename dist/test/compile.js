"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const esprima_1 = require("esprima");
const __1 = require("..");
describe('yuki-js', () => {
    describe('compile', () => {
        it('maxProgramSize', () => {
            const source = 'const x = 10';
            const program = esprima_1.parseScript(source);
            const opts = {
                maxProgramSize: 1
            };
            assert.doesNotThrow(() => __1.compile(program));
            assert.throws(() => {
                __1.compile(program, opts);
            }, {
                message: 'Program size exceeded: 8/1'
            });
        });
        it('missing functions', () => {
            const pass = 'function foo(){};function bar(){}';
            const fail = 'const x = 10';
            const passProgram = esprima_1.parseScript(pass);
            const failProgram = esprima_1.parseScript(fail);
            const opts = {
                requiredFunctions: ['foo', 'bar']
            };
            assert.doesNotThrow(() => __1.compile(passProgram, opts));
            assert.throws(() => {
                __1.compile(failProgram, opts);
            }, {
                message: 'Missing required functions: foo, bar'
            });
        });
    });
});
//# sourceMappingURL=compile.js.map