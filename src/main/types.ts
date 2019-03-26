export interface LocalFunctionNames {
  subroutines: string[]
  exports: string[]
}

export interface FunctionNames extends LocalFunctionNames {
  external: string[]
}
