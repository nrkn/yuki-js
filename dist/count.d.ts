import { YukiConst } from './declarations/value-types';
import { Program } from 'estree';
export declare const countConst: (current: YukiConst) => number;
export declare const countProgramSize: (ast: Program, instructionSize: number) => number;
