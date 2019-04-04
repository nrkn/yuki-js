"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocError = (message, node) => {
    if (node.loc) {
        const { start } = node.loc;
        message += ` at line ${start.line}, column ${start.column}`;
    }
    return Error(message);
};
exports.normalizeRangeForBitLength = (value) => value < 0 ? (value * 2) - 1 : value;
//# sourceMappingURL=util.js.map