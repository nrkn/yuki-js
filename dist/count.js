"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const bits_bytes_1 = require("bits-bytes");
const util_1 = require("./util");
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
exports.countConsts = (consts) => {
    let bitLength = 0;
    const addNumber = (value) => {
        value = util_1.normalizeRangeForBitLength(value);
        bitLength += bits_bytes_1.valueToBitLength(value);
    };
    consts.forEach(current => {
        if (current.type === 'number') {
            addNumber(current.value);
        }
        else {
            let max = 0;
            current.value.forEach(v => {
                v = util_1.normalizeRangeForBitLength(v);
                if (v > max)
                    max = v;
            });
            bitLength += bits_bytes_1.valueToBitLength(max) * current.value.length;
        }
    });
    return bitLength;
};
exports.countProgramSize = (ast, instructionSize) => {
    let count = 0;
    const visitor = {
        enter: (node, parent) => {
            if (node.type === 'Literal' && typeof node.value === 'number') {
                let value = node.value;
                if (parent &&
                    parent.type === 'UnaryExpression' &&
                    parent.operator === '-') {
                    value = util_1.normalizeRangeForBitLength(value);
                }
                count += bits_bytes_1.valueToBitLength(value);
            }
            else {
                count += instructionSize;
            }
        }
    };
    estraverse_1.traverse(ast, visitor);
    return count;
};
//# sourceMappingURL=count.js.map