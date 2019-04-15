export interface TransformOptions {
    external: ExternalScope;
    scope: LocalScope;
}
export interface ExternalScope {
    consts: string[];
    functions: string[];
}
export interface LocalScope {
    type: ScopeType;
    consts: string[];
    functions: string[];
    numbers: string[];
    arrays: string[];
    parent?: LocalScope;
}
export declare type ExternalScopeKey = 'consts' | 'functions' | 'any';
export declare type LocalScopeKey = 'consts' | 'functions' | 'numbers' | 'arrays' | 'any';
export declare type ScopeType = 'global' | 'block' | 'loop' | 'function';
