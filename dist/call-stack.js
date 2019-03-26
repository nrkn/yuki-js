"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallStack = (maxSize) => {
    let size = 0;
    const $in = () => {
        size++;
        if (size > maxSize)
            throw Error('Max call stack exceeded');
    };
    const $out = () => {
        size--;
    };
    return { $in, $out };
};
//# sourceMappingURL=call-stack.js.map