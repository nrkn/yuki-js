"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./main/util");
const validate_1 = require("./main/validate");
const replace_1 = require("./main/replace");
const build_lib_1 = require("./build-lib");
const count_1 = require("./count");
const bits_bytes_1 = require("bits-bytes");
const libScript = require("./lib-ast/lib.ast.json");
exports.compile = (yukiProgram, opts = {}) => {
    const options = Object.assign({}, exports.defaultCompileOptions, opts);
    const { memorySize, maxProgramSize, instructionSize, lib, requiredSubroutines } = options;
    const localSubroutineNames = util_1.getSubroutineNames(yukiProgram);
    const missingSubroutines = requiredSubroutines.filter(name => !localSubroutineNames.subroutines.includes(name));
    if (missingSubroutines.length)
        throw Error(`Missing required subroutines: ${missingSubroutines.join(', ')}`);
    const libFunctionNames = util_1.getLibFunctionNames(lib);
    const functionNames = Object.assign({}, localSubroutineNames, { external: ['size', ...libFunctionNames] });
    const validateMainProgram = validate_1.ValidateMainProgram(functionNames);
    const errors = validateMainProgram(yukiProgram);
    if (errors.length) {
        throw errors[0];
    }
    const addressSize = bits_bytes_1.bitLengthToBytes(bits_bytes_1.valueToBitLength(maxProgramSize));
    const libScriptAst = JSON.parse(JSON.stringify(libScript));
    const libAst = build_lib_1.buildLib(libScriptAst);
    const main = replace_1.replaceMainProgram(yukiProgram, memorySize, addressSize);
    const programSize = count_1.countProgramSize(main, instructionSize);
    if (programSize > maxProgramSize)
        throw Error(`Program size exceeded: ${programSize}/${maxProgramSize}`);
    main.body = [
        ...libAst,
        ...lib.body,
        ...main.body
    ];
    return { main, programSize };
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
    requiredSubroutines: []
};
//# sourceMappingURL=index.js.map