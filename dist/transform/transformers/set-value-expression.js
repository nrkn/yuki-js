"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scope_1 = require("../scope");
const utils_1 = require("../utils");
exports.setValueExpressionNode = (node, _parent, options) => {
    const target = (node.type === 'AssignmentExpression' ?
        node.left : node.argument);
    if (target.type === 'Identifier') {
        const { scope } = options;
        const { name } = target;
        if (scope_1.existsGlobal(scope, name, 'numbers'))
            return;
    }
    if (target.type === 'MemberExpression') {
        const { scope } = options;
        const { object } = target;
        if (object.type === 'Identifier') {
            const { name } = object;
            if (scope_1.existsGlobal(scope, name, 'arrays'))
                return;
        }
    }
    throw utils_1.LocError('Unexpected Assignment', node);
};
//# sourceMappingURL=set-value-expression.js.map