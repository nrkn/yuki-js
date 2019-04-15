"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBlock = (node) => {
    return {
        type: 'BlockStatement',
        body: [
            node
        ]
    };
};
exports.expressionToBlock = (node) => {
    if (node.type === 'IfStatement') {
        if (node.consequent.type !== 'BlockStatement') {
            node.consequent = exports.makeBlock(node.consequent);
        }
        if (node.alternate &&
            node.alternate.type !== 'BlockStatement' &&
            node.alternate.type !== 'IfStatement') {
            node.alternate = exports.makeBlock(node.alternate);
        }
        return node;
    }
    if (node.type === 'ForStatement' ||
        node.type === 'DoWhileStatement' ||
        node.type === 'WhileStatement') {
        if (node.body.type !== 'BlockStatement') {
            node.body = exports.makeBlock(node.body);
            return node;
        }
    }
};
//# sourceMappingURL=expression-to-block.js.map