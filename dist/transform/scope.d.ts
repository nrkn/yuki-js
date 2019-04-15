import { ExternalScope, ExternalScopeKey, LocalScope, LocalScopeKey, TransformOptions, ScopeType } from './types';
export declare const existsExternal: (scope: ExternalScope, name: string, key?: ExternalScopeKey) => boolean;
export declare const existsLocal: (scope: LocalScope, name: string, key?: LocalScopeKey) => boolean;
export declare const existsGlobal: (scope: LocalScope, name: string, key?: LocalScopeKey) => any;
export declare const enterScope: (options: TransformOptions, type: ScopeType) => void;
export declare const exitScope: (options: TransformOptions) => void;
export declare const countScopeDepthTo: (scope: LocalScope, type: ScopeType) => number;
