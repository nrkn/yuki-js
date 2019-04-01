"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const bits_bytes_1 = require("bits-bytes");
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
exports.countProgramSize = (ast, instructionSize) => {
    let count = 0;
    const visitor = {
        enter: (node, parent) => {
            if (node.type === 'Literal' && typeof node.value === 'number') {
                let value = node.value;
                if (parent &&
                    parent.type === 'UnaryExpression' &&
                    parent.operator === '-') {
                    value = (value * 2) - 1;
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