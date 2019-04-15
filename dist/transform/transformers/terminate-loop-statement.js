"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scope_1 = require("../scope");
const utils_1 = require("../utils");
const block_statement_1 = require("./block-statement");
exports.terminateLoopStatementNode = (node, parent, options) => {
    if (node.label)
        throw utils_1.LocError('Unexpected label', node);
    if (parent.type !== 'BlockStatement')
        throw utils_1.LocError(`Expected ${node.type} to be in block`, node);
    const { scope } = options;
    const index = parent.body.indexOf(node);
    const depth = scope_1.countScopeDepthTo(scope, 'loop');
    if (depth === -1) {
        throw utils_1.LocError(`Expected ${node.type} to be in loop`, node);
    }
    const exitStatement = {
        type: 'ExpressionStatement',
        expression: block_statement_1.ExitCall(depth)
    };
    parent.body.splice(index, 0, exitStatement);
};
//# sourceMappingURL=terminate-loop-statement.js.map