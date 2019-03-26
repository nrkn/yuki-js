"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const split_source_1 = require("./split-source");
const validate_1 = require("./declarations/validate");
const predicates_1 = require("./declarations/predicates");
const header_1 = require("./declarations/header");
const util_1 = require("./util");
const util_2 = require("./main/util");
const validate_2 = require("./main/validate");
const to_ast_1 = require("./declarations/header/to-ast");
const replace_1 = require("./main/replace");
exports.compile = (yukiProgram) => {
    const { yukiDeclarations, yukiMain } = split_source_1.splitSource(yukiProgram);
    if (!predicates_1.isYukiDeclarations(yukiDeclarations)) {
        const errors = validate_1.validateDeclarationsProgram(yukiDeclarations);
        errors.forEach(console.error);
        throw Error('Invalid Declarations');
    }
    const declarationHeader = header_1.DeclarationHeader(yukiDeclarations);
    const headerMap = util_1.HeaderMap(declarationHeader);
    const localSubroutineNames = util_2.getSubroutineNames(yukiMain);
    const functionNames = Object.assign({}, localSubroutineNames, { external: ['size'] });
    const validateMainProgram = validate_2.ValidateMainProgram(headerMap, functionNames);
    const errors = validateMainProgram(yukiMain);
    if (errors.length) {
        errors.forEach(console.error);
        throw Error('Invalid Program');
    }
    const header = to_ast_1.declarationsToAst(declarationHeader);
    const main = replace_1.replaceMainProgram(yukiMain, declarationHeader.lets);
    return { header, main };
};
//# sourceMappingURL=index.js.map