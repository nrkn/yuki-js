import { YukiLet } from './declarations/header/types';
import { Program } from 'estree';
export declare const countMemory: (lets: YukiLet[]) => number;
export declare const countProgramSize: (ast: Program, instructionSize?: number) => number;
