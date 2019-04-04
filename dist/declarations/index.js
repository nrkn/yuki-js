"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esprima_1 = require("esprima");
exports.declarationToYukiValue = (node) => {
    if (node.kind === 'const') {
        const valueType = node.kind;
        const [declarator] = node.declarations;
        const { id, init } = declarator;
        const { name } = id;
        const type = getType(init);
        const constValue = getConstValue(init);
        if (type === 'number') {
            const value = constValue;
            return {
                name, valueType, type, value
            };
        }
        else {
            const value = constValue;
            return {
                name, valueType, type, value
            };
        }
    }
    if (node.kind === 'let') {
        const valueType = node.kind;
        const [declarator] = node.declarations;
        const { id, init } = declarator;
        const { name } = id;
        if (init.type === 'Identifier') {
            const bitLength = getBitLength(init.name);
            const signed = isSigned(init.name);
            const type = 'number';
            return {
                name, valueType, type, bitLength, signed
            };
        }
        else {
            const bitLength = getBitLength(init.callee.name);
            const signed = isSigned(init.callee.name);
            const length = getLiteralValue(init.arguments[0]);
            const type = 'array';
            return {
                name, valueType, type, bitLength, length, signed
            };
        }
    }
    throw Error('Expected const or let');
};
exports.valueToAst = (value) => {
    const program = esprima_1.parseScript(`(${JSON.stringify(value)})`);
    const statement = program.body[0];
    if (statement.type !== 'ExpressionStatement')
        throw Error(`Unexpected type ${statement.type}`);
    return statement.expression;
};
exports.identifierToAst = (node) => {
    const { name } = node;
    const sequence = {
        type: 'SequenceExpression',
        expressions: [
            {
                type: 'CallExpression',
                callee: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                        type: 'Identifier',
                        name: '$context'
                    },
                    property: {
                        type: 'Identifier',
                        name: 'assert'
                    }
                },
                arguments: [
                    {
                        type: 'Literal',
                        value: name,
                        raw: name
                    }
                ]
            },
            {
                type: 'MemberExpression',
                computed: true,
                object: {
                    type: 'Identifier',
                    name: '$'
                },
                property: {
                    type: 'Literal',
                    value: name,
                    raw: name
                }
            }
        ]
    };
    return sequence;
};
exports.declarationToAst = (node) => {
    const yukiValue = exports.declarationToYukiValue(node);
    const yukiExpression = exports.valueToAst(yukiValue);
    const expression = {
        type: 'CallExpression',
        callee: {
            type: 'MemberExpression',
            computed: false,
            object: {
                type: 'Identifier',
                name: '$context'
            },
            property: {
                type: 'Identifier',
                name: 'declare'
            }
        },
        arguments: [yukiExpression]
    };
    return expression;
};
const getConstValue = (node) => {
    if (node.type === 'Literal')
        return getLiteralValue(node);
    if (node.type === 'UnaryExpression') {
        return getLiteralValue(node.argument) * -1;
    }
    return node.elements.map(getConstValue);
};
const getLiteralValue = (literal) => {
    if (typeof literal.value === 'boolean') {
        return literal.value ? 1 : 0;
    }
    return literal.value;
};
const getType = (node) => {
    if (node.type === 'Literal' || node.type === 'UnaryExpression')
        return 'number';
    return 'array';
};
const getBitLength = (name) => name === 'Bool' ? 1 : parseInt(name.replace(/\D/g, ''), 10);
const isSigned = (name) => name === 'Bool' ? false : name.startsWith('I');
//# sourceMappingURL=index.js.map