import { Statement, BlockStatement, Node } from 'estree';
export declare const makeBlock: (node: Statement) => BlockStatement;
export declare const expressionToBlock: (node: Node) => import("estree").IfStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | undefined;
