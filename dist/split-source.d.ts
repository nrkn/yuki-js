import { Program } from 'esprima';
export declare const splitSource: (program: Program) => {
    yukiDeclarations: Program;
    yukiMain: Program;
};
