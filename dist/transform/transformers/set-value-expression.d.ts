import { AssignmentExpression, UpdateExpression } from 'estree';
import { YukiNode } from '../node-types';
import { TransformOptions } from '../types';
declare type SetValueExpression = AssignmentExpression | UpdateExpression;
export declare const setValueExpressionNode: (node: SetValueExpression, _parent: YukiNode, options: TransformOptions) => void;
export {};
