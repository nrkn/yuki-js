"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockStatementNode = (node, parent) => {
    const { body } = node;
    node.body = [];
    node.body.push({
        type: 'ExpressionStatement',
        expression: exports.EnterCall()
    });
    if (parent.type === 'FunctionDeclaration') {
        const allocateCall = {
            type: 'CallExpression',
            callee: {
                type: 'Identifier',
                name: '$allocate'
            },
            arguments: [
                {
                    type: 'Identifier',
                    name: '$addressSize'
                }
            ]
        };
        node.body.push({
            type: 'ExpressionStatement',
            expression: allocateCall
        });
    }
    node.body.push(...body);
    const tail = node.body[node.body.length - 1];
    if (tail.type !== 'ReturnStatement' &&
        tail.type !== 'ContinueStatement') {
        node.body.push({
            type: 'ExpressionStatement',
            expression: exports.ExitCall()
        });
    }
    return node;
};
exports.EnterCall = () => ({
    type: 'CallExpression',
    callee: {
        type: 'Identifier',
        name: '$enter'
    },
    arguments: []
});
exports.ExitCall = (depth = 0) => ({
    type: 'CallExpression',
    callee: {
        type: 'Identifier',
        name: '$exit'
    },
    arguments: [
        {
            type: 'Literal',
            value: depth + 1
        }
    ]
});
//# sourceMappingURL=block-statement.js.map