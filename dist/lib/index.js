"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.size = (arr) => arr.length;
exports.CallStack = (maxSize, addressSize = 2) => {
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
exports.Memory = (lets, debug = false) => {
    const $ = {};
    const numbers = new Map();
    lets.forEach(l => {
        if (l.type === 'array') {
            $[l.name] = exports.ArrayProxy(l, debug);
        }
        else {
            numbers.set(l.name, l);
            $[l.name] = 0;
        }
    });
    const handler = {
        set: (target, key, value) => {
            const yukiNumber = numbers.get(key);
            if (!yukiNumber)
                throw Error(`Unexpected identifier ${key}`);
            target[key] = exports.ensureNumber(value, yukiNumber);
            return true;
        }
    };
    return new Proxy($, handler);
};
exports.ArrayProxy = (a, debug) => {
    const arr = Array(a.length).fill(0);
    const handler = {
        get: (target, key) => {
            if (typeof key === 'symbol')
                return target[key];
            const index = parseInt(key, 10);
            if (isNaN(index) && debug)
                return target[key];
            if (isNaN(index) || index < 0 || index >= a.length)
                throw Error(`Unexpected index ${key}`);
            return target[index];
        },
        set: (target, key, value) => {
            if (typeof key === 'symbol')
                return false;
            const index = parseInt(key, 10);
            if (isNaN(index) || index < 0 || index >= a.length)
                throw Error(`Index out of bounds: ${index}`);
            target[index] = exports.ensureNumber(value, a);
            return true;
        }
    };
    return new Proxy(arr, handler);
};
exports.ensureNumber = (value, l) => {
    if (typeof value !== 'number' ||
        isNaN(value) ||
        !isFinite(value)) {
        throw Error('Expected a number');
    }
    // coerce to 32 bit integer
    value = ~~value;
    if (l.signed)
        return exports.unsignedToSigned(value, l.bitLength);
    return exports.signedToUnsigned(value, l.bitLength);
};
exports.signedToUnsigned = (value, bitLength) => {
    const maxUint = exports.maxValue(bitLength);
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value < 0) {
        value += maxUint;
    }
    return value;
};
exports.unsignedToSigned = (value, bitLength) => {
    const maxUint = exports.maxValue(bitLength);
    const maxInt = Math.floor(maxUint / 2 - 1);
    const minInt = Math.floor(maxUint / 2) * -1;
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value < minInt) {
        value += maxUint;
    }
    while (value > maxInt) {
        value -= maxUint;
    }
    return value;
};
exports.maxValue = (bitLength) => Math.pow(2, bitLength);
//# sourceMappingURL=index.js.map