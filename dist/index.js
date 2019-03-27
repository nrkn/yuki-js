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
const build_lib_1 = require("./build/build-lib");
const count_1 = require("./count");
const bits_bytes_1 = require("bits-bytes");
exports.compile = (yukiProgram, opts = {}) => {
    const options = Object.assign({}, exports.defaultCompileOptions, opts);
    const { memorySize, maxProgramSize, instructionSize, lib, requiredExports } = options;
    const { yukiDeclarations, yukiMain } = split_source_1.splitSource(yukiProgram);
    if (!predicates_1.isYukiDeclarations(yukiDeclarations)) {
        const errors = validate_1.validateDeclarationsProgram(yukiDeclarations);
        errors.forEach(console.error);
        throw Error('Invalid Declarations');
    }
    const declarationHeader = header_1.DeclarationHeader(yukiDeclarations);
    const headerMap = util_1.HeaderMap(declarationHeader);
    const localSubroutineNames = util_2.getSubroutineNames(yukiMain);
    const missingExports = requiredExports.filter(name => !localSubroutineNames.exports.includes(name));
    if (missingExports.length)
        throw Error(`Missing required exports: ${missingExports.join(', ')} `);
    const libFunctionNames = util_2.getLibFunctionNames(lib);
    const functionNames = Object.assign({}, localSubroutineNames, { external: ['size', ...libFunctionNames] });
    const validateMainProgram = validate_2.ValidateMainProgram(headerMap, functionNames);
    const errors = validateMainProgram(yukiMain);
    if (errors.length) {
        errors.forEach(console.error);
        throw Error('Invalid Program');
    }
    const addressSize = bits_bytes_1.bitLengthToBytes(bits_bytes_1.valueToBitLength(memorySize));
    const memoryUsed = bits_bytes_1.bitLengthToBytes(count_1.countMemory(declarationHeader.lets));
    if (memoryUsed > memorySize)
        throw Error(`Memory allocation exceeded: ${memoryUsed}/${memorySize}`);
    const callstackMax = memorySize - memoryUsed;
    const libAst = build_lib_1.buildLib(callstackMax, addressSize);
    const header = to_ast_1.declarationsToAst(declarationHeader);
    const main = replace_1.replaceMainProgram(yukiMain, declarationHeader.lets);
    const programSize = count_1.countProgramSize(main, instructionSize);
    if (programSize > maxProgramSize)
        throw Error(`Program size exceeded: ${memoryUsed}/${memorySize}`);
    main.body = [
        ...libAst,
        ...lib.body,
        ...header.body,
        ...main.body
    ];
    return { main, memoryUsed, programSize };
};
exports.defaultCompileOptions = {
    memorySize: 1024,
    maxProgramSize: 1024,
    instructionSize: 1,
    lib: {
        type: 'Program',
        body: [],
        sourceType: 'script'
    },
    requiredExports: []
};
//# sourceMappingURL=index.js.map