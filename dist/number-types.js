"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberTypes = ['Bool'];
for (let i = 2; i <= 32; i++) {
    exports.numberTypes.push(`Uint${i}`);
    exports.numberTypes.push(`Int${i}`);
}
//# sourceMappingURL=number-types.js.map