"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const node_predicates_1 = require("../node-predicates");
const scope_1 = require("../scope");
exports.variableDeclarationNode = (node, parent, options) => {
    if (node.kind === 'const')
        return exports.constNode(node, parent, options);
    if (node.kind === 'let')
        return exports.letNode(node, parent, options);
    throw utils_1.LocError('Expected const or let', node);
};
exports.letDeclaratorNode = (node, parent, options) => {
    if (!node_predicates_1.isYukiLetDeclaration(parent))
        return;
    const yukiLetDeclarator = node;
    const { init, id } = yukiLetDeclarator;
    const { external, scope } = options;
    if (scope_1.existsExternal(external, id.name) ||
        scope_1.existsLocal(scope, id.name))
        throw utils_1.LocError(`Cannot redefine ${id.name}`, node);
    const { name } = init.callee;
    if (name.includes('Arr')) {
        scope.arrays.push(id.name);
    }
    else {
        scope.numbers.push(id.name);
    }
    const sequence = exports.declaratorToAllocate(init);
    node.init = sequence;
    return node;
};
exports.arrayExpressionNode = (node, parent) => {
    if (!node_predicates_1.isYukiConstDeclarator(parent)) {
        if (node_predicates_1.isFreezeCallExpression(parent))
            return;
        throw utils_1.LocError('Unexpected ArrayExpression', node);
    }
    return exports.freezeNode(node);
};
exports.freezeNode = (node) => {
    const freeze = {
        type: 'MemberExpression',
        object: {
            type: 'Identifier',
            name: 'Object'
        },
        property: {
            type: 'Identifier',
            name: 'freeze'
        },
        computed: false
    };
    const callFreeze = {
        type: 'CallExpression',
        callee: freeze,
        arguments: [
            node
        ]
    };
    return callFreeze;
};
exports.declaratorToAllocate = (init) => {
    const allocateCall = {
        type: 'CallExpression',
        callee: {
            type: 'Identifier',
            name: '$allocate'
        },
        arguments: [init]
    };
    return allocateCall;
};
exports.constNode = (node, _parent, options) => {
    if (!node_predicates_1.isYukiConstDeclaration(node))
        throw utils_1.LocError('Invalid const', node);
    const { external, scope } = options;
    const [declarator] = node.declarations;
    const { name } = declarator.id;
    if (scope_1.existsExternal(external, name) ||
        scope_1.existsLocal(scope, name))
        throw utils_1.LocError(`Cannot redefine ${name}`, node);
    scope.consts.push(name);
};
exports.letNode = (node, _parent, options) => {
    if (!node_predicates_1.isYukiLetDeclaration(node)) {
        const fnDepth = scope_1.countScopeDepthTo(options.scope, 'function');
        if (fnDepth === 0) {
            const [declarator] = node.declarations;
            const { init } = declarator;
            if (init &&
                init.type === 'CallExpression' &&
                init.callee.type === 'Identifier' &&
                init.callee.name === '$allocate')
                return;
            if (init && init.type === 'MemberExpression' &&
                init.object.type === 'Identifier' && init.object.name === '$args')
                return;
        }
        throw utils_1.LocError('Invalid let', node);
    }
};
//# sourceMappingURL=variable-declaration.js.map