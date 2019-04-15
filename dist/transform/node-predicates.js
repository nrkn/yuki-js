"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whitelist_1 = require("./whitelist");
const node_types_1 = require("./node-types");
const type_names_1 = require("../yuki-types/type-names");
exports.isYukiNode = (node) => node !== undefined && node !== null && whitelist_1.whitelist.includes(node.type);
exports.isPreYukiLiteral = (node) => node !== undefined && node !== null && node.type === 'Literal' &&
    (typeof node.value === 'number' || typeof node.value === 'boolean');
exports.isYukiLiteral = (node) => node.type === 'Literal' && typeof node.value === 'number';
exports.isYukiConstArrayExpression = (node) => node !== undefined && node !== null && node.type === 'ArrayExpression' &&
    node.elements.every(el => exports.isPreYukiLiteral(el) || exports.isYukiConstUnaryExpression(el));
exports.isYukiConstDeclarator = (node) => node.type === 'VariableDeclarator' && node.id.type === 'Identifier' &&
    (exports.isPreYukiLiteral(node.init) ||
        exports.isYukiConstArrayExpression(node.init) ||
        exports.isYukiConstUnaryExpression(node.init));
exports.isYukiConstDeclaration = (node) => node.type === 'VariableDeclaration' && node.kind === 'const' &&
    node.declarations.length === 1 &&
    exports.isYukiConstDeclarator(node.declarations[0]);
exports.isYukiCallExpressionDeclarator = (node) => node !== undefined && node !== null && node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    type_names_1.typeNames.includes(node.callee.name) &&
    (node.callee.name.endsWith('Arr') ? ((node.arguments.length === 1 && exports.isYukiLiteral(node.arguments[0]))) :
        node.arguments.length === 0 ||
            (node.arguments.length === 1 && exports.isYukiLiteral(node.arguments[0])));
exports.isYukiLetDeclarator = (node) => node.type === 'VariableDeclarator' && node.id.type === 'Identifier' &&
    exports.isYukiCallExpressionDeclarator(node.init);
exports.isYukiLetDeclaration = (node) => node.type === 'VariableDeclaration' && node.kind === 'let' &&
    node.declarations.length === 1 &&
    exports.isYukiLetDeclarator(node.declarations[0]);
exports.isYukiParam = (node) => node.type === 'AssignmentPattern' && node.left.type === 'Identifier' &&
    exports.isYukiCallExpressionDeclarator(node.right);
exports.isYukiParamList = (nodes) => nodes.every(exports.isYukiParam);
exports.isYukiUnaryExpression = (node) => node !== undefined && node !== null && node.type === 'UnaryExpression' &&
    node_types_1.yukiUnaryOperators.includes(node.operator);
exports.isYukiConstUnaryExpression = (node) => exports.isYukiUnaryExpression(node) && exports.isPreYukiLiteral(node.argument);
exports.isFreezeCallExpression = (node) => {
    if (node.type !== 'CallExpression')
        return false;
    const { callee } = node;
    if (callee.type === 'MemberExpression') {
        return exports.isFreezeMemberExpression(callee);
    }
    return false;
};
exports.isFreezeMemberExpression = (node) => {
    if (node.type !== 'MemberExpression')
        return false;
    const { object, property } = node;
    if (object.type === 'Identifier' && property.type === 'Identifier') {
        if (object.name === 'Object' && property.name === 'freeze')
            return true;
    }
    return false;
};
//# sourceMappingURL=node-predicates.js.map