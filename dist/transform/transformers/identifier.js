"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scope_1 = require("../scope");
const utils_1 = require("../utils");
exports.identifierNode = (node, parent, options) => {
    if (parent.type === 'VariableDeclarator')
        return;
    if (parent.type === 'FunctionDeclaration')
        return;
    if (parent.type === 'AssignmentPattern')
        return;
    const { name } = node;
    if (name === '$')
        return;
    if (name === '$args')
        return;
    const { external, scope } = options;
    const isNumber = scope_1.existsGlobal(scope, name, 'numbers');
    if (parent.type === 'MemberExpression') {
        if (parent.property.type === 'Identifier' && parent.property.name === '$')
            return;
        if (!isNumber)
            return;
    }
    if (scope_1.existsExternal(external, name))
        return;
    if (scope_1.existsGlobal(scope, name, 'arrays'))
        return;
    if (scope_1.existsGlobal(scope, name, 'consts'))
        return;
    if (scope_1.existsGlobal(scope, name, 'functions'))
        return;
    if (!isNumber)
        throw utils_1.LocError(`Unexpected identifier ${name}`, node);
    const expression = {
        type: 'MemberExpression',
        object: node,
        property: {
            type: 'Identifier',
            name: '$'
        },
        computed: false
    };
    return expression;
};
//# sourceMappingURL=identifier.js.map