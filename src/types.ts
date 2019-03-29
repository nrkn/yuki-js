import { Program } from 'estree'

export interface CompileOptions {
  memorySize: number
  maxProgramSize: number
  instructionSize: number
  lib: Program
  requiredSubroutines: string[]
}
