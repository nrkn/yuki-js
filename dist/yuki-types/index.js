"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bool = (value = 0) => {
    value = value ? 1 : 0;
    return {
        get _bitLength() {
            return 1;
        },
        get $() {
            return value;
        },
        set $(n) {
            value = n ? 1 : 0;
        }
    };
};
exports.BoolArray = (length) => {
    const values = Array(length);
    const arr = {
        get _bitLength() {
            return length;
        },
        get length() {
            return length;
        }
    };
    for (let i = 0; i < length; i++) {
        values[i] = exports.Bool();
        Object.defineProperty(arr, i, {
            get() {
                return values[i].$;
            },
            set(v) {
                values[i].$ = v;
            }
        });
    }
    return arr;
};
exports.IntFactory = (bitLength) => {
    const Int = (value = 0) => {
        value = exports.ensureSigned(value, bitLength);
        return {
            get _bitLength() {
                return bitLength;
            },
            get $() {
                return value;
            },
            set $(n) {
                value = exports.ensureSigned(n, bitLength);
            }
        };
    };
    return Int;
};
exports.ensureSigned = (value, bitLength) => {
    const maxUint = exports.maxValue(bitLength);
    const maxInt = Math.floor(maxUint / 2 - 1);
    const minInt = Math.floor(maxUint / 2) * -1;
    if (value && typeof value !== 'number' && '$' in value)
        value = value.$;
    exports.assertNumber(value);
    value = ~~value;
    while (value < minInt) {
        value += maxUint;
    }
    while (value > maxInt) {
        value -= maxUint;
    }
    return value;
};
exports.UintFactory = (bitLength) => {
    const Uint = (value = 0) => {
        value = exports.ensureUnsigned(value, bitLength);
        return {
            get _bitLength() {
                return bitLength;
            },
            get $() {
                return value;
            },
            set $(n) {
                value = exports.ensureUnsigned(n, bitLength);
            }
        };
    };
    return Uint;
};
exports.ensureUnsigned = (value, bitLength) => {
    const maxUint = exports.maxValue(bitLength);
    if (value && typeof value !== 'number' && '$' in value)
        value = value.$;
    exports.assertNumber(value);
    value = ~~value;
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value < 0) {
        value += maxUint;
    }
    return value;
};
exports.IntArrayFactory = (bitLength) => {
    const Int = exports.IntFactory(bitLength);
    const IntArray = (length) => {
        const values = Array(length);
        const arr = {
            get _bitLength() {
                return bitLength * length;
            },
            get length() {
                return length;
            }
        };
        for (let i = 0; i < length; i++) {
            values[i] = Int();
            Object.defineProperty(arr, i, {
                get() {
                    return values[i].$;
                },
                set(v) {
                    values[i].$ = v;
                }
            });
        }
        return arr;
    };
    return IntArray;
};
exports.UintArrayFactory = (bitLength) => {
    const Uint = exports.UintFactory(bitLength);
    const UintArray = (length) => {
        const values = Array(length);
        const arr = {
            get _bitLength() {
                return bitLength * length;
            },
            get length() {
                return length;
            }
        };
        for (let i = 0; i < length; i++) {
            values[i] = Uint();
            Object.defineProperty(arr, i, {
                get() {
                    return values[i].$;
                },
                set(v) {
                    values[i].$ = v;
                }
            });
        }
        return arr;
    };
    return UintArray;
};
exports.assertNumber = (value) => {
    if (typeof value === 'boolean')
        return;
    if (typeof value !== 'number' ||
        isNaN(value) ||
        !isFinite(value)) {
        throw Error('Expected a number');
    }
};
exports.maxValue = (bitLength) => Math.pow(2, bitLength);
//# sourceMappingURL=index.js.map