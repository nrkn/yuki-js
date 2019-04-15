import { Identifier, MemberExpression } from 'estree';
import { YukiNode } from '../node-types';
import { TransformOptions } from '../types';
export declare const identifierNode: (node: Identifier, parent: YukiNode, options: TransformOptions) => MemberExpression | undefined;
