import { YukiValue, YukiLet } from '../declarations/value-types';
export declare const size: (arr: any) => any;
export interface MemoryObject {
    [key: string]: number | {
        [key: string]: number;
    };
}
export interface Context {
    incMemory: (bits: number) => void;
    decMemory: (bits: number) => void;
    declare: (v: YukiValue) => number | {
        [key: string]: number;
    };
    isNumber: (name: string) => boolean;
    isArray: (name: string) => boolean;
    isConst: (name: string) => boolean;
    assert: (name: string) => void;
    usedBits: () => number;
    freeBits: () => number;
    fnIn: () => void;
    fnOut: () => void;
    $: MemoryObject;
}
export declare const $Context: (memorySize: number, addressSize: number, parent?: Context | undefined) => Context;
export declare const $ensureNumber: (value: number | boolean, l: YukiLet) => number;
export declare const $assertNumber: (value: any) => void;
export declare const $toUnsigned: (value: number | boolean, bitLength: number) => number;
export declare const $toSigned: (value: number | boolean, bitLength: number) => number;
export declare const $maxValue: (bitLength: number) => number;
