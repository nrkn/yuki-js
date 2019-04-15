import { literalNode } from './literal'

import {
  variableDeclarationNode, letDeclaratorNode, arrayExpressionNode
} from './variable-declaration'

import { blockStatementNode } from './block-statement'
import { identifierNode } from './identifier'
import { functionDeclarationNode } from './function-declaration'
import { returnStatementNode } from './return-statement'
import { terminateLoopStatementNode } from './terminate-loop-statement'
import { assignmentPatternNode } from './assignment-pattern'
import { restElementNode } from './rest-element'
import { setValueExpressionNode } from './set-value-expression'
import { memberExpressionNode } from './member-expression'
import { callExpressionNode } from './call-expression';

export const transformers = {
  Literal: literalNode,
  VariableDeclaration: variableDeclarationNode,
  VariableDeclarator: letDeclaratorNode,
  ArrayExpression: arrayExpressionNode,
  BlockStatement: blockStatementNode,
  FunctionDeclaration: functionDeclarationNode,
  Identifier: identifierNode,
  ReturnStatement: returnStatementNode,
  ContinueStatement: terminateLoopStatementNode,
  BreakStatement: terminateLoopStatementNode,
  AssignmentPattern: assignmentPatternNode,
  RestElement: restElementNode,
  AssignmentExpression: setValueExpressionNode,
  UpdateExpression: setValueExpressionNode,
  MemberExpression: memberExpressionNode,
  CallExpression: callExpressionNode
}
