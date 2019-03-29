import { YukiLet, YukiArray } from '../declarations/header/types';
export declare const size: (arr: any[]) => number;
export declare const $CallStack: (maxSize: number, addressSize?: number) => {
    $in: () => void;
    $out: () => void;
};
export interface MemoryObject {
    [key: string]: number | number[];
}
export declare const $Memory: (lets: YukiLet[]) => MemoryObject;
export declare const $ArrayProxy: (a: YukiArray) => number[];
export declare const $ensureNumber: (value: number, l: YukiLet) => number;
export declare const $toUnsigned: (value: number, bitLength: number) => number;
export declare const $toSigned: (value: number, bitLength: number) => number;
export declare const $maxValue: (bitLength: number) => number;
