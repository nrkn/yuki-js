import { Program } from 'estree';
import { YukiValue } from '../declarations/header/types';
import { FunctionNames } from './types';
export declare const ValidateMainProgram: (headerMap: Map<string, YukiValue>, functionNames: FunctionNames) => (program: Program, errors?: Error[]) => Error[];
