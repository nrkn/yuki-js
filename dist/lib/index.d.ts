import { YukiLet, YukiArray } from '../declarations/header/types';
export declare const size: (arr: any[]) => number;
export declare const CallStack: (maxSize: number, addressSize?: number) => {
    $in: () => void;
    $out: () => void;
};
export interface MemoryObject {
    [key: string]: number | number[];
}
export declare const Memory: (lets: YukiLet[], debug?: boolean) => MemoryObject;
export declare const ArrayProxy: (a: YukiArray, debug: boolean) => number[];
export declare const ensureNumber: (value: number, l: YukiLet) => number;
export declare const signedToUnsigned: (value: number, bitLength: number) => number;
export declare const unsignedToSigned: (value: number, bitLength: number) => number;
export declare const maxValue: (bitLength: number) => number;
