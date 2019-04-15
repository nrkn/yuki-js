import { BlockStatement, CallExpression } from 'estree';
import { YukiNode } from '../node-types';
export declare const blockStatementNode: (node: BlockStatement, parent: YukiNode) => BlockStatement;
export declare const EnterCall: () => CallExpression;
export declare const ExitCall: (depth?: number) => CallExpression;
