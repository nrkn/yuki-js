"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const declarations_1 = require("../declarations");
exports.replaceMainProgram = (program, memorySize, addressSize) => {
    program = JSON.parse(JSON.stringify(program));
    program.body = [
        ...initContext(memorySize, addressSize),
        ...program.body
    ];
    const visitor = {
        enter: (node, parent) => {
            if (node.type === 'Identifier') {
                if (parent &&
                    parent.type === 'MemberExpression' &&
                    parent.object.type === 'Identifier' &&
                    parent.object.name === '$')
                    return node;
                return declarations_1.identifierToAst(node);
            }
            if (node.type === 'BlockStatement') {
                const block = JSON.parse(JSON.stringify(node));
                block.body = [
                    ...enterContext(memorySize, addressSize),
                    ...block.body,
                    {
                        type: 'ExpressionStatement',
                        expression: exitContext()
                    }
                ];
                return block;
            }
            if (node.type === 'VariableDeclaration') {
                return declarations_1.declarationToAst(node);
            }
            if (node.type === 'ReturnStatement' && !node.argument) {
                return replaceReturn(node);
            }
            if (node.type === 'FunctionDeclaration') {
                return replaceFunction(node);
            }
            return node;
        }
    };
    estraverse_1.replace(program, visitor);
    return program;
};
const initContext = (memorySize, addressSize) => {
    const context = [
        {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: '$context'
                    },
                    init: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: '$Context'
                        },
                        arguments: [{
                                type: 'Literal',
                                value: memorySize,
                                raw: String(memorySize)
                            }, {
                                type: 'Literal',
                                value: addressSize,
                                raw: String(addressSize)
                            }]
                    }
                }
            ],
            kind: 'let'
        },
        {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'ObjectPattern',
                        properties: [
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: '$'
                                },
                                computed: false,
                                value: {
                                    type: 'Identifier',
                                    name: '$'
                                },
                                kind: 'init',
                                method: false,
                                shorthand: true
                            }
                        ]
                    },
                    init: {
                        type: 'Identifier',
                        name: '$context'
                    }
                }
            ],
            kind: 'let'
        }
    ];
    return context;
};
const enterContext = (memorySize, addressSize) => {
    const enter = [
        {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: '$parent'
                    },
                    init: {
                        type: 'Identifier',
                        name: '$context'
                    }
                }
            ],
            kind: 'const'
        },
        {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: '$context'
                },
                right: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: '$Context'
                    },
                    arguments: [
                        {
                            type: 'Literal',
                            value: memorySize,
                            raw: String(memorySize)
                        },
                        {
                            type: 'Literal',
                            value: addressSize,
                            raw: String(addressSize)
                        },
                        {
                            type: 'Identifier',
                            name: '$parent'
                        }
                    ]
                }
            }
        }
    ];
    return enter;
};
const exitContext = () => {
    const exit = {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
            type: 'Identifier',
            name: '$context'
        },
        right: {
            type: 'Identifier',
            name: 'parent'
        }
    };
    return exit;
};
const replaceFunction = (node) => {
    node = JSON.parse(JSON.stringify(node));
    node.body.body = [
        {
            type: 'ExpressionStatement',
            expression: {
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
                        name: 'fnIn'
                    }
                },
                arguments: []
            }
        },
        ...node.body.body,
        returnStatement()
    ];
    return node;
};
const replaceReturn = (_node) => returnStatement();
const returnStatement = () => ({
    type: 'ReturnStatement',
    argument: {
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
                        name: 'fnOut'
                    }
                },
                arguments: []
            },
            exitContext()
        ]
    }
});
//# sourceMappingURL=replace.js.map