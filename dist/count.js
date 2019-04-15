"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const bits_bytes_1 = require("bits-bytes");
exports.countProgramSize = (ast, instructionSize) => {
    let count = 0;
    const visitor = {
        enter: (node, parent) => {
            if (node.type === 'ArrayExpression') {
                let max = 0;
                node.elements.forEach(el => {
                    let value = 0;
                    if (el.type === 'Literal') {
                        if (typeof el.value === 'boolean')
                            value = 1;
                        if (typeof el.value === 'number')
                            value = bits_bytes_1.valueToBitLength(el.value);
                    }
                    if (el.type === 'UnaryExpression' && el.operator === '-') {
                        const argument = el.argument;
                        value = exports.maxForNegative(Number(argument.value));
                    }
                    if (value > max)
                        max = value;
                });
                count += max * node.elements.length;
                return estraverse_1.VisitorOption.Skip;
            }
            if (node.type === 'Literal' && typeof node.value === 'number') {
                let value = node.value;
                if (parent &&
                    parent.type === 'UnaryExpression' &&
                    parent.operator === '-') {
                    value = exports.maxForNegative(value);
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
exports.maxForNegative = (value) => value * 2 - 1;
//# sourceMappingURL=count.js.map