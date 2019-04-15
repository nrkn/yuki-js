export declare const Memory: (maxMemoryBytes: number) => {
    $allocate: (yukiValue: any) => any;
    $enter: () => void;
    $exit: (count: any) => void;
};
export declare const size: (arr: any) => any;
