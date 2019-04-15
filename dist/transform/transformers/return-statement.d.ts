import { ReturnStatement } from 'estree';
import { YukiNode } from '../node-types';
import { TransformOptions } from '../types';
export declare const returnStatementNode: (node: ReturnStatement, _parent: YukiNode, options: TransformOptions) => ReturnStatement;
