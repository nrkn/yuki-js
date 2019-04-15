import { Program } from 'estree';
import { CompileOptions } from './types';
export declare const compile: (yukiProgram: Program, opts?: Partial<CompileOptions>) => {
    program: Program;
    programSize: number;
};
