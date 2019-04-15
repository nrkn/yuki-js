"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scope_1 = require("../scope");
const utils_1 = require("../utils");
const node_predicates_1 = require("../node-predicates");
exports.memberExpressionNode = (node, _parent, options) => {
    if (node_predicates_1.isFreezeMemberExpression(node))
        return;
    const { object } = node;
    if (object.type === 'Identifier') {
        // TODO check if this is rigourous enough
        if (object.name === '$args')
            return;
        const { scope, external } = options;
        // TODO consts should be separated into arrays and numbers
        if (scope_1.existsGlobal(scope, object.name, 'consts'))
            return;
        if (scope_1.existsGlobal(scope, object.name, 'arrays'))
            return;
        // TODO external consts should also be arrays and numbers
        if (scope_1.existsExternal(external, object.name, 'consts'))
            return;
    }
    throw utils_1.LocError('Unexpected MemberExpression', node);
};
//# sourceMappingURL=member-expression.js.map