"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const assignment_pattern_1 = require("../transform/transformers/assignment-pattern");
const variable_declaration_1 = require("../transform/transformers/variable-declaration");
const call_expression_1 = require("../transform/transformers/call-expression");
const default_options_1 = require("../transform/default-options");
const esprima_1 = require("esprima");
const transform_1 = require("../transform");
const identifier_1 = require("../transform/transformers/identifier");
const literal_1 = require("../transform/transformers/literal");
const member_expression_1 = require("../transform/transformers/member-expression");
const rest_element_1 = require("../transform/transformers/rest-element");
const return_statement_1 = require("../transform/transformers/return-statement");
const set_value_expression_1 = require("../transform/transformers/set-value-expression");
const terminate_loop_statement_1 = require("../transform/transformers/terminate-loop-statement");
describe('yuki-js', () => {
    describe('transform', () => {
        describe('transformers', () => {
            const options = default_options_1.DefaultTransformOptions();
            options.external.consts.push('baz');
            const dummyParent = {
                type: 'Program',
                body: [],
                sourceType: 'script'
            };
            const assignmentPattern = {
                type: 'AssignmentPattern',
                left: {
                    type: 'Identifier',
                    name: 'foo'
                },
                right: {
                    type: 'Identifier',
                    name: 'foo'
                }
            };
            it('AssignmentPattern', () => {
                assert.throws(() => assignment_pattern_1.assignmentPatternNode(assignmentPattern), {
                    message: 'Unexpected type AssignmentPattern'
                });
            });
            it('RestElement', () => {
                const restElement = {
                    type: 'RestElement',
                    argument: {
                        type: 'Identifier',
                        name: 'foo'
                    }
                };
                assert.throws(() => rest_element_1.restElementNode(restElement, dummyParent), {
                    message: 'Unexpected type RestElement'
                });
            });
            describe('CallExpression', () => {
                it('Freeze expression', () => {
                    const freezeCall = variable_declaration_1.freezeNode({ type: 'Identifier', name: 'foo' });
                    assert.strictEqual(call_expression_1.callExpressionNode(freezeCall, dummyParent, options), undefined);
                });
                describe('Unexpected CallExpression', () => {
                    it('wrong callee type', () => {
                        const callExpression = {
                            type: 'CallExpression',
                            callee: {
                                type: 'MemberExpression',
                                object: {
                                    type: 'Identifier',
                                    name: 'foo'
                                },
                                property: {
                                    type: 'Identifier',
                                    name: 'bar'
                                },
                                computed: false
                            },
                            arguments: []
                        };
                        assert.throws(() => call_expression_1.callExpressionNode(callExpression, dummyParent, options), {
                            message: 'Unexpected CallExpression'
                        });
                    });
                    it('does not exist', () => {
                        const callExpression = {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'foo'
                            },
                            arguments: []
                        };
                        assert.throws(() => call_expression_1.callExpressionNode(callExpression, dummyParent, options), {
                            message: 'Unexpected CallExpression'
                        });
                    });
                });
            });
            describe('FunctionDeclaration', () => {
                it('Unexpected params', () => {
                    const source = 'function a( b, c ){}';
                    const program = esprima_1.parseScript(source);
                    assert.throws(() => transform_1.transform(program), { message: 'Unexpected params' });
                });
            });
            describe('Identifier', () => {
                it('early return when parent AssignmentPattern', () => {
                    assert.strictEqual(identifier_1.identifierNode({ type: 'Identifier', name: 'foo' }, assignmentPattern, options), undefined);
                });
                it('not found', () => {
                    assert.throws(() => {
                        identifier_1.identifierNode({ type: 'Identifier', name: 'bar' }, dummyParent, options);
                    }, { message: 'Unexpected identifier bar' });
                });
            });
            it('Literal', () => {
                assert.throws(() => {
                    literal_1.literalNode({ type: 'Literal', value: 'a' });
                }, {
                    message: 'Expected number or boolean'
                });
            });
            describe('MemberExpression', () => {
                it('Unexpected MemberExpression', () => {
                    assert.throws(() => {
                        const expression = {
                            type: 'MemberExpression',
                            object: {
                                type: 'Literal',
                                value: 4
                            },
                            property: {
                                type: 'Literal',
                                value: 4
                            },
                            computed: true
                        };
                        member_expression_1.memberExpressionNode(expression, dummyParent, options);
                    }, {
                        message: 'Unexpected MemberExpression'
                    });
                });
                it('does not exist', () => {
                    assert.throws(() => {
                        const expression = {
                            type: 'MemberExpression',
                            object: {
                                type: 'Identifier',
                                name: 'bar'
                            },
                            property: {
                                type: 'Literal',
                                value: 4
                            },
                            computed: true
                        };
                        member_expression_1.memberExpressionNode(expression, dummyParent, options);
                    }, {
                        message: 'Unexpected MemberExpression'
                    });
                });
                it('early return for external', () => {
                    const expression = {
                        type: 'MemberExpression',
                        object: {
                            type: 'Identifier',
                            name: 'baz'
                        },
                        property: {
                            type: 'Literal',
                            value: 4
                        },
                        computed: true
                    };
                    assert.strictEqual(member_expression_1.memberExpressionNode(expression, dummyParent, options), undefined);
                });
            });
            it('ReturnStatement', () => {
                const returnStatement = {
                    type: 'ReturnStatement'
                };
                assert.throws(() => {
                    return_statement_1.returnStatementNode(returnStatement, dummyParent, options);
                }, {
                    message: 'Unexpected return'
                });
            });
            describe('SetValueExpression', () => {
                it('Unexpected Assignment because no Identifier', () => {
                    const identifier = {
                        type: 'Identifier',
                        name: 'foo'
                    };
                    const expression = {
                        type: 'AssignmentExpression',
                        left: identifier,
                        right: {
                            type: 'Literal',
                            value: 0
                        },
                        operator: '='
                    };
                    assert.throws(() => {
                        set_value_expression_1.setValueExpressionNode(expression, dummyParent, options);
                    }, { message: 'Unexpected Assignment' });
                });
                it('Unexpected Assignment because no MemberExpression', () => {
                    const member = {
                        type: 'MemberExpression',
                        object: {
                            type: 'Identifier',
                            name: 'foo'
                        },
                        property: {
                            type: 'Literal',
                            value: 0
                        },
                        computed: true
                    };
                    const expression = {
                        type: 'AssignmentExpression',
                        left: member,
                        right: {
                            type: 'Literal',
                            value: 0
                        },
                        operator: '='
                    };
                    assert.throws(() => {
                        set_value_expression_1.setValueExpressionNode(expression, dummyParent, options);
                    }, { message: 'Unexpected Assignment' });
                });
            });
            describe('TerminateLoopStatementNode', () => {
                it('Unexpected label', () => {
                    const statement = {
                        type: 'ContinueStatement',
                        label: {
                            type: 'Identifier',
                            name: 'foo'
                        }
                    };
                    assert.throws(() => {
                        terminate_loop_statement_1.terminateLoopStatementNode(statement, dummyParent, options);
                    }, {
                        message: 'Unexpected label'
                    });
                });
                it('Expected ContinueStatement to be in block', () => {
                    const statement = {
                        type: 'ContinueStatement'
                    };
                    assert.throws(() => {
                        terminate_loop_statement_1.terminateLoopStatementNode(statement, dummyParent, options);
                    }, {
                        message: 'Expected ContinueStatement to be in block'
                    });
                });
                it('Expected ContinueStatement to be in loop', () => {
                    const statement = {
                        type: 'ContinueStatement'
                    };
                    const block = {
                        type: 'BlockStatement',
                        body: [
                            statement
                        ]
                    };
                    assert.throws(() => {
                        terminate_loop_statement_1.terminateLoopStatementNode(statement, block, options);
                    }, {
                        message: 'Expected ContinueStatement to be in loop'
                    });
                });
            });
            describe('VariableDeclaration', () => {
                it('Expected const or let', () => {
                    const declaration = {
                        type: 'VariableDeclaration',
                        declarations: [],
                        kind: 'var'
                    };
                    assert.throws(() => {
                        variable_declaration_1.variableDeclarationNode(declaration, dummyParent, options);
                    }, {
                        message: 'Expected const or let'
                    });
                });
                it('Cannot redefine', () => {
                    const scope = {
                        type: 'block',
                        consts: [],
                        numbers: ['foo'],
                        arrays: [],
                        functions: []
                    };
                    const opts = {
                        scope,
                        external: options.external
                    };
                    const declarator = {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'Identifier',
                            name: 'foo'
                        },
                        init: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'Int8'
                            },
                            arguments: []
                        }
                    };
                    const declaration = {
                        type: 'VariableDeclaration',
                        declarations: [
                            declarator
                        ],
                        kind: 'let'
                    };
                    assert.throws(() => {
                        variable_declaration_1.letDeclaratorNode(declarator, declaration, opts);
                    }, {
                        message: 'Cannot redefine foo'
                    });
                });
                it('Unexpected ArrayExpression', () => {
                    const arrayExpression = {
                        type: 'ArrayExpression',
                        elements: []
                    };
                    assert.throws(() => {
                        variable_declaration_1.arrayExpressionNode(arrayExpression, dummyParent);
                    }, {
                        message: 'Unexpected ArrayExpression'
                    });
                });
                describe('constNode', () => {
                    it('Invalid const', () => {
                        const constDeclaration = {
                            type: 'VariableDeclaration',
                            declarations: [],
                            kind: 'const'
                        };
                        assert.throws(() => {
                            variable_declaration_1.constNode(constDeclaration, dummyParent, options);
                        }, {
                            message: 'Invalid const'
                        });
                    });
                    it('Cannot redefine', () => {
                        const scope = {
                            type: 'block',
                            consts: [],
                            numbers: ['foo'],
                            arrays: [],
                            functions: []
                        };
                        const opts = {
                            scope,
                            external: options.external
                        };
                        const declarator = {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'foo'
                            },
                            init: {
                                type: 'Literal',
                                value: 0
                            }
                        };
                        const declaration = {
                            type: 'VariableDeclaration',
                            declarations: [
                                declarator
                            ],
                            kind: 'const'
                        };
                        assert.throws(() => {
                            variable_declaration_1.constNode(declaration, dummyParent, opts);
                        }, {
                            message: 'Cannot redefine foo'
                        });
                    });
                });
                describe('letNode', () => {
                    it('Invalid let', () => {
                        const declaration = {
                            type: 'VariableDeclaration',
                            declarations: [],
                            kind: 'let'
                        };
                        assert.throws(() => {
                            variable_declaration_1.letNode(declaration, dummyParent, options);
                        }, {
                            message: 'Invalid let'
                        });
                    });
                    it('Invalid let because bad sequence', () => {
                        const scope = {
                            type: 'function',
                            consts: [],
                            numbers: [],
                            arrays: [],
                            functions: []
                        };
                        const opts = {
                            scope,
                            external: options.external
                        };
                        const node = {
                            type: 'VariableDeclaration',
                            declarations: [
                                {
                                    type: 'VariableDeclarator',
                                    id: {
                                        type: 'Identifier',
                                        name: 'a'
                                    },
                                    init: {
                                        type: 'SequenceExpression',
                                        expressions: [
                                            {
                                                type: 'CallExpression',
                                                callee: {
                                                    type: 'Identifier',
                                                    name: 'foo'
                                                },
                                                arguments: [
                                                    {
                                                        type: 'Literal',
                                                        value: 8
                                                    }
                                                ]
                                            },
                                            {
                                                type: 'CallExpression',
                                                callee: {
                                                    type: 'Identifier',
                                                    name: 'Uint8'
                                                },
                                                arguments: []
                                            }
                                        ]
                                    }
                                }
                            ],
                            kind: 'let'
                        };
                        assert.throws(() => {
                            variable_declaration_1.letNode(node, dummyParent, opts);
                        }, {
                            message: 'Invalid let'
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=transformers.js.map