import { YukiType } from './index';
export declare const typeNames: string[];
export declare const typeFactories: TypeFactoryMap;
export interface TypeFactoryMap {
    [name: string]: (arg: number) => YukiType;
}
