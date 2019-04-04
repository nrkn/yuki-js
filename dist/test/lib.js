"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const lib_1 = require("../lib");
describe('yuki-js', () => {
    describe('main', () => {
        describe('ensureNumber', () => {
            const signed = {
                name: 'int8',
                valueType: 'let',
                type: 'number',
                bitLength: 8,
                signed: true
            };
            const unsigned = {
                name: 'uint8',
                valueType: 'let',
                type: 'number',
                bitLength: 8,
                signed: false
            };
            it('Only accepts finite numbers', () => {
                assert.throws(() => {
                    lib_1.$ensureNumber('a', unsigned);
                }, { message: 'Expected a number' });
                assert.throws(() => {
                    lib_1.$ensureNumber(NaN, unsigned);
                }, { message: 'Expected a number' });
                assert.throws(() => {
                    lib_1.$ensureNumber(Infinity, unsigned);
                }, { message: 'Expected a number' });
                assert.throws(() => {
                    lib_1.$ensureNumber('a', signed);
                }, { message: 'Expected a number' });
                assert.throws(() => {
                    lib_1.$ensureNumber(NaN, signed);
                }, { message: 'Expected a number' });
                assert.throws(() => {
                    lib_1.$ensureNumber(Infinity, signed);
                }, { message: 'Expected a number' });
            });
            it('wraps unsigned numbers', () => {
                assert.strictEqual(lib_1.$ensureNumber(256, unsigned), 0);
                assert.strictEqual(lib_1.$ensureNumber(345, unsigned), 89);
            });
            it('wraps signed numbers', () => {
                assert.strictEqual(lib_1.$ensureNumber(-129, signed), 127);
                assert.strictEqual(lib_1.$ensureNumber(-345, signed), -89);
            });
            it('coerces unsigned to signed', () => {
                assert.strictEqual(lib_1.$ensureNumber(135, signed), -121);
                assert.strictEqual(lib_1.$ensureNumber(345, signed), 89);
            });
            it('coerces signed to unsigned', () => {
                assert.strictEqual(lib_1.$ensureNumber(-256, unsigned), 0);
                assert.strictEqual(lib_1.$ensureNumber(-345, unsigned), 167);
            });
            it('coerces boolean to number', () => {
                assert.strictEqual(lib_1.$ensureNumber(true, unsigned), 1);
                assert.strictEqual(lib_1.$ensureNumber(false, unsigned), 0);
                assert.strictEqual(lib_1.$ensureNumber(true, signed), 1);
                assert.strictEqual(lib_1.$ensureNumber(false, signed), 0);
            });
        });
    });
});
//# sourceMappingURL=lib.js.map