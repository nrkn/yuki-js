import { Program } from 'estree';
import { CompileOptions } from './types';
export declare const compile: (yukiProgram: Program, opts?: Partial<CompileOptions>) => {
    main: Program;
    memoryUsed: number;
    programSize: number;
};
export declare const defaultCompileOptions: CompileOptions;
