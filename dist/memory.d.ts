import { YukiLet } from './declarations/header/types';
export interface MemoryObject {
    [key: string]: number | number[];
}
export declare const Memory: (lets: YukiLet[], debug?: boolean) => MemoryObject;
