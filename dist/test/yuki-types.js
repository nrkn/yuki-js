"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const yuki_types_1 = require("../yuki-types");
describe('yuki-js', () => {
    describe('yuki-types', () => {
        describe('Bool', () => {
            it('default value', () => {
                const bool = yuki_types_1.Bool();
                assert.strictEqual(bool.$, 0);
            });
            it('truthy', () => {
                const bool = yuki_types_1.Bool(true);
                assert.strictEqual(bool.$, 1);
            });
            it('get/set', () => {
                const bool = yuki_types_1.Bool();
                bool.$ = true;
                assert.strictEqual(bool.$, 1);
                bool.$ = false;
                assert.strictEqual(bool.$, 0);
            });
            it('_bitLength', () => {
                const bool = yuki_types_1.Bool();
                assert.strictEqual(bool._bitLength, 1);
            });
        });
        describe('BoolArray', () => {
            it('creates', () => {
                const bools = yuki_types_1.BoolArray(10);
                const arr = Array.from(bools);
                assert.strictEqual(arr.length, 10);
                assert(arr.every(v => v === 0));
            });
            it('get/set', () => {
                const expect = [0, 1, 0, 1, 0];
                const bools = yuki_types_1.BoolArray(expect.length);
                for (let i = 0; i < expect.length; i++) {
                    bools[i] = expect[i];
                }
                const arr = Array.from(bools);
                assert.deepEqual(arr, expect);
            });
            it('_bitLength', () => {
                const bools = yuki_types_1.BoolArray(10);
                assert.strictEqual(bools._bitLength, 10);
            });
        });
        describe('IntFactory', () => {
            const Int = yuki_types_1.IntFactory(8);
            it('default value', () => {
                assert.strictEqual(Int().$, 0);
            });
            it('coerces value', () => {
                const a = Int(-129);
                const b = Int(-345);
                const c = Int(135);
                const d = Int(345);
                assert.strictEqual(a.$, 127);
                assert.strictEqual(b.$, -89);
                assert.strictEqual(c.$, -121);
                assert.strictEqual(d.$, 89);
            });
            it('from YukiNumber', () => {
                const yukiNumber = {
                    _bitLength: 8,
                    $: 10
                };
                const a = Int(yukiNumber);
                assert.strictEqual(a.$, 10);
            });
            it('get/set', () => {
                const a = Int();
                a.$ = 10;
                assert.strictEqual(a.$, 10);
            });
            it('_bitLength', () => {
                const a = Int();
                assert.strictEqual(a._bitLength, 8);
            });
        });
        describe('UintFactory', () => {
            const Uint = yuki_types_1.UintFactory(8);
            it('default value', () => {
                assert.strictEqual(Uint().$, 0);
            });
            it('coerces value', () => {
                const a = Uint(256);
                const b = Uint(345);
                const c = Uint(-256);
                const d = Uint(-345);
                assert.strictEqual(a.$, 0);
                assert.strictEqual(b.$, 89);
                assert.strictEqual(c.$, 0);
                assert.strictEqual(d.$, 167);
            });
            it('from YukiNumber', () => {
                const yukiNumber = {
                    _bitLength: 8,
                    $: 10
                };
                const a = Uint(yukiNumber);
                assert.strictEqual(a.$, 10);
            });
            it('get/set', () => {
                const a = Uint();
                a.$ = 10;
                assert.strictEqual(a.$, 10);
            });
            it('_bitLength', () => {
                const a = Uint();
                assert.strictEqual(a._bitLength, 8);
            });
        });
        describe('IntArray', () => {
            const IntArray = yuki_types_1.IntArrayFactory(8);
            it('creates', () => {
                const values = IntArray(10);
                const arr = Array.from(values);
                assert.strictEqual(arr.length, 10);
                assert(arr.every(v => v === 0));
            });
            it('get/set', () => {
                const expect = [-2, -1, 0, 1, 2];
                const values = IntArray(expect.length);
                for (let i = 0; i < expect.length; i++) {
                    values[i] = expect[i];
                }
                const arr = Array.from(values);
                assert.deepEqual(arr, expect);
            });
            it('_bitLength', () => {
                const a = IntArray(10);
                assert.strictEqual(a._bitLength, 80);
            });
        });
        describe('UintArray', () => {
            const UintArray = yuki_types_1.UintArrayFactory(8);
            it('creates', () => {
                const values = UintArray(10);
                const arr = Array.from(values);
                assert.strictEqual(arr.length, 10);
                assert(arr.every(v => v === 0));
            });
            it('get/set', () => {
                const expect = [1, 2, 3, 4, 5];
                const values = UintArray(expect.length);
                for (let i = 0; i < expect.length; i++) {
                    values[i] = expect[i];
                }
                const arr = Array.from(values);
                assert.deepEqual(arr, expect);
            });
            it('_bitLength', () => {
                const a = UintArray(10);
                assert.strictEqual(a._bitLength, 80);
            });
        });
        describe('assertNumber', () => {
            it('accepts bool', () => {
                assert.doesNotThrow(() => yuki_types_1.assertNumber(true));
            });
            it('must be number', () => {
                assert.throws(() => yuki_types_1.assertNumber('foo'));
            });
            it('must not be NaN', () => {
                assert.throws(() => yuki_types_1.assertNumber(NaN));
            });
            it('must be finite', () => {
                assert.throws(() => yuki_types_1.assertNumber(Infinity));
            });
        });
    });
});
//# sourceMappingURL=yuki-types.js.map