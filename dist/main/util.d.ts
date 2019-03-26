import { Program } from 'estree';
import { LocalFunctionNames, FunctionNames } from './types';
export declare const getSubroutineNames: (program: Program) => LocalFunctionNames;
export declare const getAllNames: (functionNames: FunctionNames) => string[];
