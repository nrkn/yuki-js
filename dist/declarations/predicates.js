"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("./validate");
exports.isYukiDeclarations = (program) => {
    const errors = validate_1.validateDeclarationsProgram(program);
    return errors.length === 0;
};
//# sourceMappingURL=predicates.js.map