"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esprima_1 = require("esprima");
exports.declarationsToAst = (declarations) => {
    const program = {
        type: 'Program',
        body: [],
        sourceType: 'script'
    };
    declarations.consts.forEach(c => {
        if (c.type === 'array') {
            program.body.push(yukiConstArrayToAst(c));
        }
        else {
            program.body.push(yukiConstNumberToAst(c));
        }
    });
    program.body.push(yukiLetsToAst(declarations.lets));
    return program;
};
const yukiConstNumberToAst = (num) => {
    const { name, value } = num;
    const raw = String(value);
    const init = (value < 0 ?
        {
            type: 'UnaryExpression',
            operator: '-',
            prefix: true,
            argument: {
                type: 'Literal',
                value: value * -1,
                raw: String(value * -1)
            }
        } :
        {
            type: 'Literal',
            value,
            raw
        });
    const declaration = {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name
                },
                init
            }
        ],
        kind: 'const'
    };
    return declaration;
};
const yukiConstArrayToAst = (arr) => {
    const { name, value } = arr;
    const arrayExpression = {
        type: 'ArrayExpression',
        elements: value.map(v => (v < 0 ?
            {
                type: 'UnaryExpression',
                operator: '-',
                prefix: true,
                argument: {
                    type: 'Literal',
                    value: v * -1,
                    raw: String(v * -1)
                }
            } :
            {
                type: 'Literal',
                value: v,
                raw: String(v)
            }))
    };
    const declaration = {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name
                },
                init: {
                    type: 'CallExpression',
                    callee: {
                        type: 'MemberExpression',
                        computed: false,
                        object: {
                            type: 'Identifier',
                            name: 'Object'
                        },
                        property: {
                            type: 'Identifier',
                            name: 'freeze'
                        }
                    },
                    arguments: [
                        arrayExpression
                    ]
                }
            }
        ],
        kind: 'const'
    };
    return declaration;
};
const yukiLetsToAst = (lets) => {
    const letsJson = esprima_1.parseScript(JSON.stringify(lets));
    const jsonExpression = letsJson.body[0];
    const jsonArray = jsonExpression.expression;
    const objectDeclaration = {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: '$'
                },
                init: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: '$Memory'
                    },
                    arguments: [jsonArray]
                }
            }
        ],
        kind: 'const'
    };
    return objectDeclaration;
};
//# sourceMappingURL=to-ast.js.map