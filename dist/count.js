"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const bits_bytes_1 = require("bits-bytes");
const util_1 = require("./util");
const declarations_1 = require("./declarations");
exports.countConst = (current) => {
    if (current.type === 'number') {
        const value = util_1.normalizeRangeForBitLength(current.value);
        return bits_bytes_1.valueToBitLength(value);
    }
    else {
        let max = 0;
        current.value.forEach(v => {
            v = util_1.normalizeRangeForBitLength(v);
            if (v > max)
                max = v;
        });
        return bits_bytes_1.valueToBitLength(max) * current.value.length;
    }
};
exports.countProgramSize = (ast, instructionSize) => {
    let programSize = 0;
    let constBits = 0;
    const visitor = {
        enter: (node, parent) => {
            if (node.type === 'Literal' && typeof node.value === 'number') {
                let value = node.value;
                if (parent &&
                    parent.type === 'UnaryExpression' &&
                    parent.operator === '-') {
                    value = util_1.normalizeRangeForBitLength(value);
                }
                programSize += bits_bytes_1.valueToBitLength(value);
            }
            else if (node.type === 'VariableDeclaration' && node.kind === 'const') {
                const c = declarations_1.declarationToYukiValue(node);
                constBits += exports.countConst(c);
            }
            else {
                programSize += instructionSize;
            }
        }
    };
    estraverse_1.traverse(ast, visitor);
    programSize += Math.ceil(constBits / 8);
    return programSize;
};
//# sourceMappingURL=count.js.map