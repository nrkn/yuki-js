import { ContinueStatement, BreakStatement } from 'estree';
import { YukiNode } from '../node-types';
import { TransformOptions } from '../types';
declare type TerminateLoopStatement = ContinueStatement | BreakStatement;
export declare const terminateLoopStatementNode: (node: TerminateLoopStatement, parent: YukiNode, options: TransformOptions) => void;
export {};
