import {
  ExpressionStatement, Program, AssignmentExpression, Identifier,
  MemberExpression, Literal, CallExpression, UpdateExpression, BinaryExpression,
  LogicalExpression, SequenceExpression, UnaryExpression, ConditionalExpression,
  ForStatement, BlockStatement, WhileStatement, IfStatement, BreakStatement,
  ContinueStatement, DoWhileStatement, FunctionDeclaration, ReturnStatement,
  SimpleLiteral, VariableDeclaration, VariableDeclarator, ArrayExpression,
  SimpleCallExpression, AssignmentPattern, RestElement, EmptyStatement
} from 'estree'

export type YukiNode =
  Program | ExpressionStatement | AssignmentExpression | Identifier |
  MemberExpression | Literal | CallExpression | UpdateExpression |
  BinaryExpression | LogicalExpression | SequenceExpression | UnaryExpression |
  ConditionalExpression | ForStatement | BlockStatement | WhileStatement |
  IfStatement | BreakStatement | WhileStatement | IfStatement | BreakStatement |
  ContinueStatement | DoWhileStatement | FunctionDeclaration | ReturnStatement |
  ArrayExpression | VariableDeclaration | VariableDeclarator |
  AssignmentPattern | RestElement | EmptyStatement


export interface PreYukiLiteral extends SimpleLiteral {
  value: number | boolean
}

export interface YukiLiteral extends SimpleLiteral {
  value: number
}

export interface YukiConstDeclaration extends VariableDeclaration {
  kind: 'const'
  declarations: [ YukiConstDeclarator ]
}

export interface YukiConstDeclarator extends VariableDeclarator {
  id: Identifier
  init: YukiLiteral | YukiConstArrayExpression
}

export interface YukiConstArrayExpression extends ArrayExpression {
  elements: YukiLiteral[]
}

export interface YukiCallExpressionDeclarator extends SimpleCallExpression {
  callee: Identifier
  arguments: [] | [ YukiLiteral ]
}

export interface YukiLetDeclarator extends VariableDeclarator {
  id: Identifier
  init: YukiCallExpressionDeclarator
}

export interface YukiLetDeclaration extends VariableDeclaration {
  kind: 'let'
  declarations: [ YukiLetDeclarator ]
}

export interface YukiParam extends AssignmentPattern {
  left: Identifier
  right: YukiCallExpressionDeclarator
}

export type YukiUnaryOperator  = "-" | "+" | "!" | "~"

export interface YukiUnaryExpression extends UnaryExpression {
  operator: YukiUnaryOperator
}

export interface YukiConstUnaryExpression extends YukiUnaryExpression {
  argument: PreYukiLiteral
}

export interface FreezeCallExpression extends SimpleCallExpression {
  callee: FreezeMemberExpression
}

export interface FreezeMemberExpression extends MemberExpression {
  object: FreezeObjectIdentifier
  property: FreezePropertyIdentifier
}

export interface FreezeObjectIdentifier extends Identifier {
  name: 'Object'
}

export interface FreezePropertyIdentifier extends Identifier {
  name: 'freeze'
}

export const yukiUnaryOperators = [ '-', '+', '!', '~' ]
