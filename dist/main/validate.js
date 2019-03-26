"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const estraverse_1 = require("estraverse");
const util_2 = require("./util");
// first pass - whitelist validation
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
    'ReturnStatement',
    'ExportNamedDeclaration'
];
exports.ValidateMainProgram = (headerMap, functionNames) => {
    const validateNode = ValidateNode(headerMap, functionNames);
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
const ValidateNode = (headerMap, functionNames) => {
    const allNames = util_2.getAllNames(functionNames);
    const validateIdentifer = ValidateIdentifier(headerMap, allNames);
    const validateMemberExpression = ValidateMemberExpression(headerMap);
    const validators = {
        Identifier: validateIdentifer,
        MemberExpression: validateMemberExpression,
        AssignmentExpression: ValidateAssignmentExpression(headerMap, validateIdentifer, validateMemberExpression),
        CallExpression: ValidateCallExpression(functionNames),
        FunctionDeclaration: validateFunctionDeclaration,
        ExportNamedDeclaration: validateExportNamedDeclaration,
        ReturnStatement: validateReturnStatement,
        Literal: validateLiteral
    };
    const validateNode = (node) => {
        const errors = [];
        if (node.type in validators) {
            errors.push(...validators[node.type](node));
        }
        return errors;
    };
    return validateNode;
};
const ValidateAssignmentExpression = (headerMap, validateIdentifier, validateMemberExpression) => {
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
            if (!target) {
                errors.push(util_1.LocError(`Unexpected assignment to ${identifier.name}`, identifier));
                return errors;
            }
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
const ValidateIdentifier = (headerMap, functionNames) => (node) => {
    const errors = [];
    if (headerMap.has(node.name))
        return errors;
    if (functionNames.includes(node.name))
        return errors;
    errors.push(util_1.LocError(`Unexpected Identifier ${node.name}`, node));
    return errors;
};
const ValidateMemberExpression = (headerMap) => (node) => {
    const errors = [];
    if (node.object.type !== 'Identifier') {
        errors.push(util_1.LocError(`Unexpected Identifier ${node.object}`, node));
        return errors;
    }
    const target = headerMap.get(node.object.name);
    if (!target) {
        errors.push(util_1.LocError(`Unexpected Identifier ${node.object.name}`, node));
        return errors;
    }
    if (target.type !== 'array') {
        errors.push(util_1.LocError(`Expected array target ${node.object.name}`, node));
        return errors;
    }
    return errors;
};
const ValidateCallExpression = (functionNames) => (node) => {
    const errors = [];
    if (node.callee.type !== 'Identifier') {
        errors.push(util_1.LocError('Expected Identifier', node.callee));
        return errors;
    }
    const { name } = node.callee;
    if (functionNames.subroutines.includes(name) ||
        functionNames.exports.includes(name)) {
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
const validateFunctionDeclaration = (node) => {
    const errors = [];
    if (!node.id) {
        errors.push(util_1.LocError('Expected Identifier', node));
        return errors;
    }
    if (node.params.length) {
        errors.push(util_1.LocError('Unexpected params', node));
        return errors;
    }
    return errors;
};
const validateExportNamedDeclaration = (node) => {
    const errors = [];
    if (!node.declaration) {
        errors.push(util_1.LocError('Expected declaration', node));
        return errors;
    }
    if (node.declaration.type !== 'FunctionDeclaration') {
        errors.push(util_1.LocError('Unexpected Declaration', node.declaration));
        return errors;
    }
    return errors;
};
const validateReturnStatement = (node) => {
    const errors = [];
    if (node.argument) {
        errors.push(util_1.LocError('Unexpected argument', node));
    }
    return errors;
};
const validateLiteral = (node) => {
    const errors = [];
    if (typeof node.value === 'number' || typeof node.value === 'boolean')
        return errors;
    errors.push(util_1.LocError(`Unexpected Literal ${node.value}`, node));
    return errors;
};
//# sourceMappingURL=validate.js.map