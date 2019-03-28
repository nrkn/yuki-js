"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const esprima_1 = require("esprima");
const __1 = require("..");
describe('yuki-js', () => {
    describe('compile', () => {
        it('Invalid Declarations', () => {
            const program = esprima_1.parseScript('var x = Int8', { loc: true });
            assert.throws(() => __1.compile(program), {
                message: 'Unexpected var at line 1, column 0'
            });
        });
        it('Missing required exports', () => {
            const program = esprima_1.parseScript('');
            assert.throws(() => __1.compile(program, { requiredExports: ['tick'] }), {
                message: 'Missing required exports: tick'
            });
        });
        it('Invalid Main', () => {
            const program = esprima_1.parseScript('""', { loc: true });
            assert.throws(() => __1.compile(program), {
                message: 'Unexpected type string at line 1, column 0'
            });
        });
        it('Memory allocation exceeded', () => {
            const program = esprima_1.parseScript('let x = Uint16');
            assert.throws(() => __1.compile(program, { memorySize: 1 }), {
                message: 'Memory allocation exceeded: 2/1'
            });
        });
        it('Program size exceeded', () => {
            const program = esprima_1.parseScript('let x = Uint16; x = 0');
            assert.throws(() => __1.compile(program, { maxProgramSize: 1 }), {
                message: 'Program size exceeded: 7/1'
            });
        });
    });
});
//# sourceMappingURL=compile.js.map