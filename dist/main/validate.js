"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const estraverse_1 = require("estraverse");
const util_2 = require("./util");
const whitelist = [
    'Program',
    'ExpressionStatement',
    'AssignmentExpression',
    'Identifier',
    'MemberExpression',
    'Literal',
    'CallExpression',
    'UpdateExpression',
    'BinaryExpression',
    'LogicalExpression',
    'SequenceExpression',
    'UnaryExpression',
    'ConditionalExpression',
    'ForStatement',
    'BlockStatement',
    'WhileStatement',
    'IfStatement',
    'BreakStatement',
    'ContinueStatement',
    'DoWhileStatement',
    'FunctionDeclaration',
    'ReturnStatement'
];
exports.ValidateMainProgram = (headerMap, functionNames) => {
    const validateNode = exports.ValidateNode(headerMap, functionNames);
    const validateMainProgram = (program, errors = []) => {
        const validationVisitor = {
            enter: node => {
                errors.push(...validateNode(node));
            }
        };
        estraverse_1.traverse(program, validationVisitor);
        return errors;
    };
    return validateMainProgram;
};
exports.ValidateNode = (headerMap, functionNames) => {
    const allNames = util_2.getAllNames(functionNames);
    const validateIdentifer = exports.ValidateIdentifier(headerMap, allNames);
    const validateMemberExpression = exports.ValidateMemberExpression(headerMap);
    const validators = {
        Identifier: validateIdentifer,
        MemberExpression: validateMemberExpression,
        AssignmentExpression: exports.ValidateAssignmentExpression(headerMap, validateIdentifer, validateMemberExpression),
        CallExpression: exports.ValidateCallExpression(functionNames),
        FunctionDeclaration: exports.ValidateFunctionDeclaration(functionNames.external),
        ReturnStatement: exports.validateReturnStatement,
        Literal: exports.validateLiteral
    };
    const validateNode = (node) => {
        const errors = [];
        if (node.type in validators) {
            errors.push(...validators[node.type](node));
        }
        else if (!whitelist.includes(node.type)) {
            errors.push(util_1.LocError(`Unexpected type ${node.type}`, node));
        }
        return errors;
    };
    return validateNode;
};
exports.ValidateIdentifier = (headerMap, functionNames) => (node) => {
    const errors = [];
    if (headerMap.has(node.name))
        return errors;
    if (functionNames.includes(node.name))
        return errors;
    errors.push(util_1.LocError(`Unexpected Identifier ${node.name}`, node));
    return errors;
};
exports.ValidateMemberExpression = (headerMap) => (node) => {
    const errors = [];
    if (node.object.type !== 'Identifier') {
        errors.push(util_1.LocError(`Unexpected type ${node.object.type}`, node));
        return errors;
    }
    const target = headerMap.get(node.object.name);
    if (!target) {
        errors.push(util_1.LocError(`Unexpected name ${node.object.name}`, node));
        return errors;
    }
    if (target.type !== 'array') {
        errors.push(util_1.LocError(`Unexpected number ${node.object.name}`, node));
        return errors;
    }
    return errors;
};
exports.ValidateAssignmentExpression = (headerMap, validateIdentifier, validateMemberExpression) => {
    const validateAssignmentExpression = (node) => {
        const errors = [];
        const { left } = node;
        if (left.type === 'Identifier') {
            const baseErrors = validateIdentifier(left);
            if (baseErrors.length)
                return baseErrors;
            const target = headerMap.get(left.name);
            if (!target) {
                errors.push(util_1.LocError(`Unexpected assignment to ${left.name}`, left));
                return errors;
            }
            if (target.type === 'array') {
                errors.push(util_1.LocError('Unexpected assignment to array', target));
                return errors;
            }
            if (target.valueType === 'const') {
                errors.push(util_1.LocError('Unexpected assignment to const', target));
                return errors;
            }
            return errors;
        }
        if (left.type === 'MemberExpression') {
            const baseErrors = validateMemberExpression(left);
            if (baseErrors.length)
                return baseErrors;
            const identifier = left.object;
            const target = headerMap.get(identifier.name);
            if (target.valueType === 'const') {
                errors.push(util_1.LocError('Unexpected assignment to const', target));
                return errors;
            }
            return errors;
        }
        errors.push(util_1.LocError('Expected Identifier or MemberExpression', left));
        return errors;
    };
    return validateAssignmentExpression;
};
exports.ValidateCallExpression = (functionNames) => (node) => {
    const errors = [];
    if (node.callee.type !== 'Identifier') {
        errors.push(util_1.LocError('Expected Identifier', node.callee));
        return errors;
    }
    const { name } = node.callee;
    if (functionNames.subroutines.includes(name)) {
        if (node.arguments.length) {
            errors.push(util_1.LocError('Unexpected arguments', node));
            return errors;
        }
        return errors;
    }
    if (functionNames.external.includes(name))
        return errors;
    errors.push(util_1.LocError(`Unexpected Identifier ${name}`, node.callee));
    return errors;
};
exports.ValidateFunctionDeclaration = (externals) => (node) => {
    const errors = [];
    if (node.id.name.startsWith('$')) {
        errors.push(util_1.LocError('Function names cannot start with $', node));
        return errors;
    }
    if (externals.includes(node.id.name)) {
        errors.push(util_1.LocError(`Cannot redefine external function ${node.id.name}`, node));
        return errors;
    }
    if (node.params.length) {
        errors.push(util_1.LocError('Unexpected params', node));
        return errors;
    }
    return errors;
};
exports.validateReturnStatement = (node) => {
    const errors = [];
    if (node.argument) {
        errors.push(util_1.LocError('Unexpected argument', node));
    }
    return errors;
};
exports.validateLiteral = (node) => {
    const errors = [];
    const literalType = typeof node.value;
    if (literalType === 'number' || literalType === 'boolean')
        return errors;
    errors.push(util_1.LocError(`Unexpected type ${literalType}`, node));
    return errors;
};
//# sourceMappingURL=validate.js.map