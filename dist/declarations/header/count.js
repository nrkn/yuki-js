"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bits_bytes_1 = require("bits-bytes");
exports.countRom = (consts) => {
    let bitLength = 0;
    consts.forEach(current => {
        if (current.type === 'number') {
            bitLength += bits_bytes_1.valueToBitLength(current.value);
        }
        else {
            bitLength += bits_bytes_1.valueToBitLength(current.value.length);
            current.value.forEach(v => {
                bitLength += bits_bytes_1.valueToBitLength(v);
            });
        }
    });
    return bitLength;
};
exports.countMemory = (lets) => {
    let bitLength = 0;
    lets.forEach(current => {
        if (current.type === 'number') {
            bitLength += current.bitLength;
        }
        else {
            bitLength += current.bitLength * current.length;
        }
    });
    return bitLength;
};
//# sourceMappingURL=count.js.map