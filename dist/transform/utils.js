"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocError = (message, node) => {
    if (node.loc) {
        const { start } = node.loc;
        message += ` at line ${start.line}, column ${start.column}`;
    }
    return Error(message);
};
//# sourceMappingURL=utils.js.map