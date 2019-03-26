"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = (lets, debug = false) => {
    const $ = {};
    const numbers = new Map();
    lets.forEach(l => {
        if (l.type === 'array') {
            $[l.name] = ArrayProxy(l, debug);
        }
        else {
            numbers.set(l.name, l);
            $[l.name] = 0;
        }
    });
    const handler = {
        set: (target, key, value) => {
            if (typeof key !== 'string')
                return false;
            const yukiNumber = numbers.get(key);
            if (!yukiNumber)
                return false;
            target[key] = ensureNumber(value, yukiNumber);
            return true;
        }
    };
    return new Proxy($, handler);
};
const ArrayProxy = (a, debug) => {
    const arr = Array(a.length).fill(0);
    const handler = {
        get: (target, key) => {
            if (typeof key === 'symbol')
                return target[key];
            const index = typeof key === 'number' ? key : parseInt(key, 10);
            if (isNaN(index) && debug)
                return target[key];
            if (isNaN(index) || index < 0 || index >= a.length)
                throw Error(`Unexpected index ${key}`);
            return target[index];
        },
        set: (target, key, value) => {
            if (typeof key === 'symbol')
                return false;
            const index = typeof key === 'number' ? key : parseInt(key, 10);
            if (isNaN(index) || index < 0 || index >= a.length)
                return false;
            target[index] = ensureNumber(value, a);
            return true;
        }
    };
    return new Proxy(arr, handler);
};
const ensureNumber = (value, l) => l.signed ?
    unsignedToSigned(value, l.bitLength) :
    signedToUnsigned(value, l.bitLength);
const signedToUnsigned = (value, bitLength) => {
    const maxUint = maxValue(bitLength);
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value < 0) {
        value += maxUint;
    }
    return value;
};
const unsignedToSigned = (value, bitLength) => {
    const maxUint = maxValue(bitLength);
    const maxInt = Math.floor(maxUint / 2 - 1);
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value > maxInt) {
        value -= maxUint;
    }
    return value;
};
const maxValue = (bitLength) => Math.pow(2, bitLength);
//# sourceMappingURL=memory.js.map