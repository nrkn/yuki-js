import { VariableDeclaration, Identifier, ArrayExpression, SimpleLiteral, SimpleCallExpression, Program, VariableDeclarator } from 'estree';
export interface YukiDeclarationProgram extends Program {
    body: YukiDeclaration[];
}
export declare type YukiDeclaration = YukiConstDeclaration | YukiLetDeclaration;
export interface YukiConstDeclaration extends VariableDeclaration {
    kind: 'const';
    declarations: [YukiConstDeclarator];
}
export interface YukiLetDeclaration extends VariableDeclaration {
    kind: 'let';
    declarations: [YukiLetDeclarator];
}
export interface YukiDeclarator extends VariableDeclarator {
    id: Identifier;
    init: YukiLiteral | YukiArrayExpression | Identifier | YukiArrayDeclaration;
}
export interface YukiConstDeclarator extends YukiDeclarator {
    init: YukiLiteral | YukiArrayExpression;
}
export interface YukiLetDeclarator extends YukiDeclarator {
    init: Identifier | YukiArrayDeclaration;
}
export interface YukiLiteral extends SimpleLiteral {
    value: boolean | number;
}
export interface YukiBooleanLiteral extends YukiLiteral {
    value: boolean;
}
export interface YukiNumberLiteral extends YukiLiteral {
    value: number;
}
export interface YukiArrayExpression extends ArrayExpression {
    elements: YukiBooleanLiteral[] | YukiNumberLiteral[];
}
export interface YukiArrayDeclaration extends SimpleCallExpression {
    callee: Identifier;
    arguments: [YukiNumberLiteral];
}
