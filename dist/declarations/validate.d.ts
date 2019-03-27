import { Program, VariableDeclarator } from 'estree';
export declare const validateDeclarationsProgram: (program: Program, errors?: Error[]) => Error[];
export declare const validateConst: (declarator: VariableDeclarator, errors?: Error[]) => Error[];
export declare const validateLet: (declarator: VariableDeclarator, errors?: Error[]) => Error[];
