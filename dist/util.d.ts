import { BaseNode } from 'estree';
import { YukiDeclarationHeader, YukiValue } from './declarations/header/types';
export declare const LocError: (message: string, node: BaseNode) => Error;
export declare const HeaderMap: (header: YukiDeclarationHeader) => Map<string, YukiValue>;
export declare const normalizeRangeForBitLength: (value: number) => number;
