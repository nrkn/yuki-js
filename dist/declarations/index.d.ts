import { YukiDeclaration } from './types';
import { Identifier, SequenceExpression } from 'estree';
export declare const declarationToYukiValue: (node: YukiDeclaration) => import("./value-types").YukiConstNumber | import("./value-types").YukiConstArray | import("./value-types").YukiNumber | import("./value-types").YukiArray;
export declare const valueToAst: (value: any) => import("estree").Expression;
export declare const identifierToAst: (node: Identifier) => SequenceExpression;
export declare const declarationToAst: (node: YukiDeclaration) => import("estree").SimpleCallExpression;
