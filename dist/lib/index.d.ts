import { YukiLet } from '../declarations/header/types';
export declare const size: (arr: any) => any;
export declare const $CallStack: (maxSize: number, addressSize?: number) => {
    $in: () => void;
    $out: () => void;
};
export interface MemoryObject {
    [key: string]: number | {
        [key: string]: number;
    };
}
export declare const $Memory: (lets: YukiLet[]) => MemoryObject;
export declare const $ensureNumber: (value: number | boolean, l: YukiLet) => number;
export declare const $assertNumber: (value: any) => void;
export declare const $toUnsigned: (value: number | boolean, bitLength: number) => number;
export declare const $toSigned: (value: number | boolean, bitLength: number) => number;
export declare const $maxValue: (bitLength: number) => number;
