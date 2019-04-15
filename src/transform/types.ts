export interface TransformOptions {
  external: ExternalScope
  scope: LocalScope
}

export interface ExternalScope {
  consts: string[]
  functions: string[]
}

export interface LocalScope {
  type: ScopeType
  consts: string[]
  functions: string[]
  numbers: string[]
  arrays: string[]
  parent?: LocalScope
}

export type ExternalScopeKey = 'consts' | 'functions' | 'any'

export type LocalScopeKey = 'consts' | 'functions' | 'numbers' | 'arrays' | 'any'

export type ScopeType = 'global' | 'block' | 'loop' | 'function'
