export declare const Bool: (value?: any) => YukiNumber;
export declare const BoolArray: (length: number) => YukiArray;
export declare const IntFactory: (bitLength: number) => (value?: number) => YukiNumber;
export declare const ensureSigned: (value: any, bitLength: number) => any;
export declare const UintFactory: (bitLength: number) => (value?: number) => YukiNumber;
export declare const ensureUnsigned: (value: any, bitLength: number) => any;
export declare const IntArrayFactory: (bitLength: number) => (length: number) => YukiArray;
export declare const UintArrayFactory: (bitLength: number) => (length: number) => YukiArray;
export declare const assertNumber: (value: any) => void;
export declare const maxValue: (bitLength: number) => number;
export interface YukiArray {
    readonly _bitLength: number;
    readonly length: number;
    [n: number]: number;
}
export interface YukiNumber {
    readonly _bitLength: number;
    $: number;
}
export declare type YukiType = YukiArray | YukiNumber;
