"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_predicates_1 = require("../node-predicates");
const utils_1 = require("../utils");
const variable_declaration_1 = require("./variable-declaration");
exports.functionDeclarationNode = (node, _parent, options) => {
    const { params } = node;
    if (!node_predicates_1.isYukiParamList(params))
        throw utils_1.LocError('Unexpected params', node);
    const { scope } = options;
    scope.functions.push(node.id.name);
    node.params = [
        {
            type: 'RestElement',
            argument: {
                type: 'Identifier',
                name: '$args'
            }
        }
    ];
    const lets = params.map((param, i) => {
        if (param.right.callee.name.includes('Arr')) {
            return yukiArrayParamToLet(param, options, i);
        }
        else {
            return yukiNumberParamToLet(param, options, i);
        }
    });
    node.body.body = [
        ...lets,
        ...node.body.body
    ];
    return node;
};
const yukiNumberParamToLet = (param, options, index) => {
    const { scope } = options;
    scope.numbers.push(param.left.name);
    const right = param.right;
    const expression = {
        type: 'MemberExpression',
        object: {
            type: 'Identifier',
            name: '$args'
        },
        property: {
            type: 'Literal',
            value: index
        },
        computed: true
    };
    right.arguments = [expression];
    const sequence = variable_declaration_1.declaratorToAllocate(param.right);
    const declarator = {
        type: 'VariableDeclarator',
        id: param.left,
        init: sequence
    };
    const declaration = {
        type: 'VariableDeclaration',
        declarations: [declarator],
        kind: 'let'
    };
    return declaration;
};
const yukiArrayParamToLet = (param, options, index) => {
    const { scope } = options;
    scope.arrays.push(param.left.name);
    const expression = {
        type: 'MemberExpression',
        object: {
            type: 'Identifier',
            name: '$args'
        },
        property: {
            type: 'Literal',
            value: index
        },
        computed: true
    };
    const declarator = {
        type: 'VariableDeclarator',
        id: param.left,
        init: expression
    };
    const declaration = {
        type: 'VariableDeclaration',
        declarations: [declarator],
        kind: 'let'
    };
    return declaration;
};
//# sourceMappingURL=function-declaration.js.map