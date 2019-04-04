"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.size = (arr) => arr.length;
exports.$Context = (memorySize, addressSize, parent) => {
    let bitLength = 0;
    const $ = {};
    const valueMap = new Map();
    if (parent) {
        Object.keys(parent).forEach(name => {
            if (parent.isNumber(name)) {
                if (parent.isConst(name)) {
                    Object.defineProperty($, name, {
                        get() {
                            return parent.$[name];
                        }
                    });
                }
                else {
                    Object.defineProperty($, name, {
                        get() {
                            return parent.$[name];
                        },
                        set(value) {
                            parent.$[name] = value;
                        }
                    });
                }
            }
            else {
                $[name] = parent.$[name];
            }
        });
    }
    const incMemory = (bits) => {
        bitLength += bits;
        if (freeBits() < 0)
            throw Error('Out of memory');
    };
    const decMemory = (bits) => bitLength -= bits;
    const declare = (v) => {
        if (valueMap.has(v.name))
            throw Error(`${v.name} already declared`);
        if (v.valueType === 'let') {
            const l = v;
            if (l.type === 'number') {
                incMemory(l.bitLength);
                valueMap.set(l.name, l);
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
            else {
                incMemory(l.bitLength * l.length);
                valueMap.set(l.name, l);
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
        }
        else {
            const c = v;
            if (c.type === 'number') {
                valueMap.set(c.name, c);
                Object.defineProperty($, c.name, {
                    get() {
                        return c.value;
                    }
                });
            }
            else {
                valueMap.set(c.name, c);
                const arr = {};
                for (let i = 0; i < c.value.length; i++) {
                    Object.defineProperty(arr, i, {
                        get() {
                            return c.value[i];
                        }
                    });
                }
                Object.defineProperty(arr, 'length', { get() { return c.value.length; } });
                $[c.name] = arr;
            }
        }
        return $[v.name];
    };
    const isNumber = (name) => {
        if (valueMap.has(name))
            return valueMap.get(name).type === 'number';
        if (parent)
            return parent.isNumber(name);
        return false;
    };
    const isArray = (name) => {
        if (valueMap.has(name))
            return valueMap.get(name).type === 'array';
        if (parent)
            return parent.isArray(name);
        return false;
    };
    const isConst = (name) => {
        if (valueMap.has(name))
            return valueMap.get(name).valueType === 'const';
        if (parent)
            return parent.isConst(name);
        return false;
    };
    const assert = (name) => {
        if (valueMap.has(name))
            return;
        if (parent) {
            parent.assert(name);
            return;
        }
        throw Error(`Unexpected Identifier ${name}`);
    };
    const usedBits = () => bitLength + (parent ? parent.usedBits() : 0);
    const freeBits = () => (memorySize * 8) - usedBits();
    const fnIn = () => incMemory(addressSize * 8);
    const fnOut = () => decMemory(addressSize * 8);
    return {
        incMemory, decMemory, declare, isNumber, isArray, isConst, assert,
        usedBits, freeBits, fnIn, fnOut, $
    };
};
exports.$ensureNumber = (value, l) => {
    if (l.signed)
        return exports.$toSigned(value, l.bitLength);
    return exports.$toUnsigned(value, l.bitLength);
};
exports.$assertNumber = (value) => {
    if (typeof value === 'boolean')
        return;
    if (typeof value !== 'number' ||
        isNaN(value) ||
        !isFinite(value)) {
        throw Error('Expected a number');
    }
};
exports.$toUnsigned = (value, bitLength) => {
    exports.$assertNumber(value);
    // coerce to 32 bit integer
    value = ~~value;
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
    exports.$assertNumber(value);
    // coerce to 32 bit integer
    value = ~~value;
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