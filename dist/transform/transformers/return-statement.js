"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_statement_1 = require("./block-statement");
const scope_1 = require("../scope");
exports.returnStatementNode = (node, _parent, options) => {
    const { argument } = node;
    const { scope } = options;
    const depth = scope_1.countScopeDepthTo(scope, 'function');
    if (depth === -1) {
        throw Error('Unexpected return');
    }
    if (argument) {
        const sequence = {
            type: 'SequenceExpression',
            expressions: [
                block_statement_1.ExitCall(),
                argument
            ]
        };
        node.argument = sequence;
    }
    else {
        node.argument = block_statement_1.ExitCall(depth);
    }
    return node;
};
//# sourceMappingURL=return-statement.js.map