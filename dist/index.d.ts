import { Program } from 'estree';
import { CompileOptions } from './types';
export declare const compile: (yukiProgram: Program, opts?: Partial<CompileOptions>) => {
    main: Program;
    programSize: number;
};
export declare const defaultCompileOptions: CompileOptions;
