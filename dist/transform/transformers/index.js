"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const literal_1 = require("./literal");
const variable_declaration_1 = require("./variable-declaration");
const block_statement_1 = require("./block-statement");
const identifier_1 = require("./identifier");
const function_declaration_1 = require("./function-declaration");
const return_statement_1 = require("./return-statement");
const terminate_loop_statement_1 = require("./terminate-loop-statement");
const assignment_pattern_1 = require("./assignment-pattern");
const rest_element_1 = require("./rest-element");
const set_value_expression_1 = require("./set-value-expression");
const member_expression_1 = require("./member-expression");
const call_expression_1 = require("./call-expression");
exports.transformers = {
    Literal: literal_1.literalNode,
    VariableDeclaration: variable_declaration_1.variableDeclarationNode,
    VariableDeclarator: variable_declaration_1.letDeclaratorNode,
    ArrayExpression: variable_declaration_1.arrayExpressionNode,
    BlockStatement: block_statement_1.blockStatementNode,
    FunctionDeclaration: function_declaration_1.functionDeclarationNode,
    Identifier: identifier_1.identifierNode,
    ReturnStatement: return_statement_1.returnStatementNode,
    ContinueStatement: terminate_loop_statement_1.terminateLoopStatementNode,
    BreakStatement: terminate_loop_statement_1.terminateLoopStatementNode,
    AssignmentPattern: assignment_pattern_1.assignmentPatternNode,
    RestElement: rest_element_1.restElementNode,
    AssignmentExpression: set_value_expression_1.setValueExpressionNode,
    UpdateExpression: set_value_expression_1.setValueExpressionNode,
    MemberExpression: member_expression_1.memberExpressionNode,
    CallExpression: call_expression_1.callExpressionNode
};
//# sourceMappingURL=index.js.map