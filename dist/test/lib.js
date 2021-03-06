"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const lib_1 = require("../lib");
describe('yuki-js', () => {
    describe('main', () => {
        describe('CallStack', () => {
            it('Max call stack exceeded', () => {
                const maxSize = 10;
                const { $in } = lib_1.$CallStack(maxSize, 1);
                assert.throws(() => {
                    for (let i = 0; i < maxSize + 1; i++) {
                        $in();
                    }
                }, {
                    message: 'Max call stack exceeded'
                });
            });
            it('Exits correctly', () => {
                const maxSize = 10;
                const { $in, $out } = lib_1.$CallStack(maxSize);
                assert.doesNotThrow(() => {
                    for (let i = 0; i < maxSize + 1; i++) {
                        $in();
                        $out();
                    }
                });
            });
        });
        describe('Memory', () => {
            const lets = [
                {
                    name: 'int8',
                    valueType: 'let',
                    type: 'number',
                    bitLength: 8,
                    signed: true
                },
                {
                    name: 'uint8',
                    valueType: 'let',
                    type: 'number',
                    bitLength: 8,
                    signed: false
                },
                {
                    name: 'arrInt8',
                    valueType: 'let',
                    type: 'array',
                    bitLength: 8,
                    length: 3,
                    signed: true
                },
                {
                    name: 'arrUint8',
                    valueType: 'let',
                    type: 'array',
                    bitLength: 8,
                    length: 3,
                    signed: false
                }
            ];
            const memory = lib_1.$Memory(lets);
            it('sets number', () => {
                memory.int8 = 10;
                assert.strictEqual(memory.int8, 10);
            });
            it('Expected a number', () => {
                assert.throws(() => {
                    memory.int8 = 'a';
                }, { message: 'Expected a number' });
                assert.throws(() => {
                    memory.int8 = NaN;
                }, { message: 'Expected a number' });
                assert.throws(() => {
                    memory.int8 = Infinity;
                }, { message: 'Expected a number' });
            });
            it('sets array member', () => {
                memory.arrInt8[0] = 10;
                assert.strictEqual(memory.arrInt8[0], 10);
            });
            it('raw', () => {
                memory.int8 = -10;
                memory.uint8 = 10;
                for (let i = 0; i < 3; i++) {
                    memory.arrInt8[i] = -i;
                    memory.arrUint8[i] = i;
                }
                const raw = memory.$;
                assert.deepEqual(raw, {
                    int8: -10,
                    uint8: 10,
                    arrInt8: [0, -1, -2],
                    arrUint8: [0, 1, 2]
                });
            });
            it('size', () => {
                assert.strictEqual(lib_1.size(memory.arrInt8), 3);
            });
        });
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