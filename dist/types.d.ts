import { Program } from 'estree';
import { ExternalScope } from './transform/types';
export interface CompileOptions {
    memorySize: number;
    maxProgramSize: number;
    instructionSize: number;
    externalLib: Program;
    externalScope: ExternalScope;
    requiredFunctions: string[];
}
