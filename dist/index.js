"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_options_1 = require("./default-options");
const default_options_2 = require("./transform/default-options");
const transform_1 = require("./transform");
const libObj = require("./lib/lib.json");
const bits_bytes_1 = require("bits-bytes");
const transform_lib_1 = require("./transform/transform-lib");
const count_1 = require("./count");
exports.compile = (yukiProgram, opts = {}) => {
    const options = Object.assign({}, default_options_1.DefaultCompileOptions(), opts);
    const { memorySize, maxProgramSize, instructionSize, externalLib, externalScope, requiredFunctions } = options;
    const programSize = count_1.countProgramSize(yukiProgram, instructionSize);
    if (programSize > maxProgramSize)
        throw Error(`Program size exceeded: ${programSize}/${maxProgramSize}`);
    const transformOptions = default_options_2.DefaultTransformOptions();
    transformOptions.external.consts.push(...externalScope.consts);
    transformOptions.external.functions.push(...externalScope.functions);
    const program = transform_1.transform(yukiProgram, transformOptions);
    const programFunctions = transformOptions.scope.functions;
    const missingFunctions = requiredFunctions.filter(name => !programFunctions.includes(name));
    if (missingFunctions.length)
        throw Error(`Missing required functions: ${missingFunctions.join(', ')}`);
    const addressSize = bits_bytes_1.bitLengthToBytes(bits_bytes_1.valueToBitLength(maxProgramSize));
    let lib = JSON.parse(JSON.stringify(libObj));
    lib = transform_lib_1.transformLib(lib, memorySize, addressSize);
    const initCall = {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'Identifier',
                name: '$init'
            },
            arguments: []
        }
    };
    program.body = [
        ...lib.body,
        ...externalLib.body,
        ...program.body,
        initCall
    ];
    return { program, programSize };
};
//# sourceMappingURL=index.js.map