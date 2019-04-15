"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scope_1 = require("../scope");
const utils_1 = require("../utils");
const node_predicates_1 = require("../node-predicates");
exports.callExpressionNode = (node, _parent, options) => {
    if (node_predicates_1.isFreezeCallExpression(node))
        return;
    const { callee } = node;
    if (callee.type === 'Identifier') {
        const { scope, external } = options;
        if (scope_1.existsGlobal(scope, callee.name, 'functions'))
            return;
        if (scope_1.existsExternal(external, callee.name, 'functions'))
            return;
    }
    throw utils_1.LocError('Unexpected CallExpression', node);
};
//# sourceMappingURL=call-expression.js.map