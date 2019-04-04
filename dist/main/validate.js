"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const estraverse_1 = require("estraverse");
const number_types_1 = require("../number-types");
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
    'VariableDecloration',
    'VariableDeclarator'
];
exports.ValidateMainProgram = (functionNames) => {
    const validateNode = exports.ValidateNode(functionNames);
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
exports.ValidateNode = (functionNames) => {
    const validators = {
        MemberExpression: exports.validateMemberExpression,
        AssignmentExpression: exports.ValidateAssignmentExpression(exports.validateMemberExpression),
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
exports.ValidateIdentifier = (functionNames) => (node) => {
    const errors = [];
    if (functionNames.includes(node.name))
        return errors;
    errors.push(util_1.LocError(`Unexpected Identifier ${node.name}`, node));
    return errors;
};
exports.validateMemberExpression = (node) => {
    const errors = [];
    if (node.object.type !== 'Identifier') {
        errors.push(util_1.LocError(`Unexpected type ${node.object.type}`, node));
        return errors;
    }
    return errors;
};
exports.ValidateAssignmentExpression = (validateMemberExpression) => {
    const validateAssignmentExpression = (node) => {
        const errors = [];
        const { left } = node;
        if (left.type === 'Identifier') {
            return errors;
        }
        if (left.type === 'MemberExpression') {
            const baseErrors = validateMemberExpression(left);
            if (baseErrors.length)
                return baseErrors;
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
exports.validateVariableDeclaration = (declaration, errors = []) => {
    if (declaration.kind === 'var') {
        errors.push(util_1.LocError('Unexpected var', declaration));
        return errors;
    }
    if (declaration.declarations.length !== 1) {
        errors.push(util_1.LocError('Expected a single declaration', declaration));
        return errors;
    }
    const declarator = declaration.declarations[0];
    const { id, init } = declarator;
    if (init === null) {
        errors.push(util_1.LocError('Expected init', declarator));
        return errors;
    }
    if (id.type !== 'Identifier') {
        errors.push(util_1.LocError('Expected Identifier', declarator));
        return errors;
    }
    if (id.name.startsWith('$')) {
        errors.push(util_1.LocError('Identifier names cannot start with $', declarator));
        return errors;
    }
    if (declaration.kind === 'const') {
        errors.push(...exports.validateConst(declarator, errors));
        return errors;
    }
    errors.push(...exports.validateLet(declarator, errors));
    return errors;
};
exports.validateLiteral = (literal, parent, errors) => {
    const literalType = typeof literal.value;
    if (literalType === 'number' || literalType === 'boolean')
        return errors;
    errors.push(util_1.LocError(`Unexpected type ${literalType}`, parent));
    return errors;
};
exports.validateUnaryExpression = (unary, parent, errors) => {
    if (unary.operator !== '-') {
        errors.push(util_1.LocError('Expected UnaryExpression operator to be -', unary));
        return errors;
    }
    const { argument } = unary;
    if (argument.type === 'Literal') {
        errors.push(...exports.validateLiteral(argument, parent, errors));
        return errors;
    }
    errors.push(util_1.LocError('Expected UnaryExpression argument to be Literal', unary));
    return errors;
};
exports.validateConst = (declarator, errors = []) => {
    const init = declarator.init;
    if (init.type === 'Literal') {
        errors.push(...exports.validateLiteral(init, declarator, errors));
        return errors;
    }
    if (init.type === 'UnaryExpression') {
        errors.push(...exports.validateUnaryExpression(init, declarator, errors));
        return errors;
    }
    if (init.type === 'ArrayExpression') {
        const { elements } = init;
        if (elements.length < 1) {
            errors.push(util_1.LocError('Unexpected empty ArrayExpression', declarator));
            return errors;
        }
        let firstType = 'undefined';
        elements.forEach((node, i) => {
            if (node.type === 'Literal') {
                if (i === 0)
                    firstType = typeof node.value;
                if (typeof node.value !== firstType) {
                    errors.push(util_1.LocError(`Expected ArrayExpression[${i}] to be ${firstType}`, node));
                    return;
                }
                if (typeof node.value === 'boolean')
                    return;
                if (typeof node.value === 'number')
                    return;
                errors.push(util_1.LocError(`Unexpected ${typeof node.value} in ArrayExpression[${i}]`, node));
                return;
            }
            if (node.type === 'UnaryExpression') {
                errors.push(...exports.validateUnaryExpression(node, node, errors));
                return;
            }
            errors.push(util_1.LocError(`Expected ArrayExpression[${i}] to be Literal or UnaryExpression`, node));
        });
        return errors;
    }
    errors.push(util_1.LocError(`Unexpected type ${init.type}`, declarator));
    return errors;
};
exports.validateLet = (declarator, errors = []) => {
    const init = declarator.init;
    if (init.type === 'Identifier') {
        if (number_types_1.numberTypes.includes(init.name))
            return errors;
        errors.push(util_1.LocError(`Unexpected init name ${init.name}`, declarator));
        return errors;
    }
    if (init.type === 'CallExpression') {
        if (init.callee.type === 'Identifier') {
            if (number_types_1.numberTypes.includes(init.callee.name)) {
                if (init.arguments.length !== 1) {
                    errors.push(util_1.LocError(`Expected single argument`, declarator));
                    return errors;
                }
                const argument = init.arguments[0];
                if (argument.type === 'Literal') {
                    if (typeof argument.value === 'number')
                        return errors;
                    errors.push(util_1.LocError(`Unexpected argument ${typeof argument.value}`, argument));
                    return errors;
                }
                errors.push(util_1.LocError(`Unexpected argument type ${argument.type}`, argument));
                return errors;
            }
            errors.push(util_1.LocError(`Unexpected callee name ${init.callee.name}`, init.callee));
            return errors;
        }
        errors.push(util_1.LocError(`Unexpected callee type ${init.callee.type}`, init.callee));
        return errors;
    }
    errors.push(util_1.LocError(`Unexpected init type ${init.type}`, init));
    return errors;
};
//# sourceMappingURL=validate.js.map