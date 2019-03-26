"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const number_types_1 = require("../number-types");
const util_1 = require("../util");
exports.validateDeclarationsProgram = (program, errors = []) => {
    program.body.forEach((node, i) => {
        if (node.type === 'VariableDeclaration') {
            errors.push(...validateVariableDeclaration(node));
        }
        else {
            errors.push(util_1.LocError('Expected VariableDeclaration', node));
        }
    });
    return errors;
};
const validateVariableDeclaration = (declaration, errors = []) => {
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
    if (typeof init === 'undefined') {
        errors.push(util_1.LocError('Expected init', declarator));
    }
    if (id.type !== 'Identifier') {
        errors.push(util_1.LocError('Expected Identifier', declarator));
        return errors;
    }
    if (declaration.kind === 'const') {
        errors.push(...validateConst(declarator, errors));
        return errors;
    }
    if (declaration.kind === 'let') {
        errors.push(...validateLet(declarator, errors));
        return errors;
    }
    errors.push(util_1.LocError('Expected const or let', declaration));
    return errors;
};
const validateConst = (declarator, errors = []) => {
    const init = declarator.init;
    if (init.type === 'Literal') {
        if (typeof init.value === 'boolean')
            return errors;
        if (typeof init.value === 'number')
            return errors;
        errors.push(util_1.LocError('Expected boolean or number', declarator));
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
            }
            errors.push(util_1.LocError(`Expected ArrayExpression[${i}] to be Literal`, node));
        });
        return errors;
    }
    errors.push(util_1.LocError(`Unexpected type ${init.type}`, declarator));
    return errors;
};
const validateLet = (declarator, errors = []) => {
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
                }
                const argument = init.arguments[0];
                if (argument.type === 'Literal') {
                    if (typeof argument.value === 'number')
                        return errors;
                    errors.push(util_1.LocError(`Unexpected argument ${argument.value}`, argument));
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