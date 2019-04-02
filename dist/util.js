"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocError = (message, node) => {
    if (node.loc) {
        const { start } = node.loc;
        message += ` at line ${start.line}, column ${start.column}`;
    }
    return Error(message);
};
exports.HeaderMap = (header) => {
    const headerMap = new Map();
    header.consts.forEach(c => headerMap.set(c.name, c));
    header.lets.forEach(l => headerMap.set(l.name, l));
    return headerMap;
};
exports.normalizeRangeForBitLength = (value) => value < 0 ? (value * 2) - 1 : value;
//# sourceMappingURL=util.js.map