"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.size = (arr) => arr.length;
exports.$CallStack = (maxSize, addressSize = 2) => {
    let callStackSize = 0;
    const $in = () => {
        callStackSize += addressSize;
        if (callStackSize > maxSize)
            throw Error('Max call stack exceeded');
    };
    const $out = () => {
        callStackSize -= addressSize;
    };
    return { $in, $out };
};
exports.$Memory = (lets) => {
    const $ = {};
    lets.forEach(l => {
        if (l.type === 'array') {
            const arr = {};
            const data = Array(l.length).fill(0);
            for (let i = 0; i < l.length; i++) {
                Object.defineProperty(arr, i, {
                    get() {
                        return data[i];
                    },
                    set(value) {
                        data[i] = exports.$ensureNumber(value, l);
                    }
                });
            }
            Object.defineProperty(arr, 'length', { get() { return l.length; } });
            $[l.name] = arr;
        }
        else {
            let data = 0;
            Object.defineProperty($, l.name, {
                get() {
                    return data;
                },
                set(value) {
                    data = exports.$ensureNumber(value, l);
                }
            });
        }
    });
    Object.defineProperty($, '$', {
        get() {
            const raw = {};
            lets.forEach(l => {
                if (l.type === 'number') {
                    raw[l.name] = $[l.name];
                }
                else {
                    raw[l.name] = Array(l.length);
                    for (let i = 0; i < l.length; i++) {
                        raw[l.name][i] = $[l.name][i];
                    }
                }
            });
            return raw;
        }
    });
    return $;
};
exports.$ensureNumber = (value, l) => {
    if (typeof value !== 'number' ||
        isNaN(value) ||
        !isFinite(value)) {
        throw Error('Expected a number');
    }
    // coerce to 32 bit integer
    value = ~~value;
    if (l.signed)
        return exports.$toSigned(value, l.bitLength);
    return exports.$toUnsigned(value, l.bitLength);
};
exports.$toUnsigned = (value, bitLength) => {
    const maxUint = exports.$maxValue(bitLength);
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value < 0) {
        value += maxUint;
    }
    return value;
};
exports.$toSigned = (value, bitLength) => {
    const maxUint = exports.$maxValue(bitLength);
    const maxInt = Math.floor(maxUint / 2 - 1);
    const minInt = Math.floor(maxUint / 2) * -1;
    while (value < minInt) {
        value += maxUint;
    }
    while (value > maxInt) {
        value -= maxUint;
    }
    return value;
};
exports.$maxValue = (bitLength) => Math.pow(2, bitLength);
//# sourceMappingURL=index.js.map