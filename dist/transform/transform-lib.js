"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
exports.transformLib = (lib, memorySize, addressSize) => {
    return estraverse_1.replace(lib, {
        enter: node => {
            if (node.type === 'VariableDeclaration' && node.kind === 'const') {
                if (node.declarations.length === 1) {
                    const [declarator] = node.declarations;
                    if (declarator.id.type === 'Identifier') {
                        if (declarator.id.name === '$maxMemory') {
                            declarator.init = {
                                type: 'Literal',
                                value: memorySize
                            };
                            return node;
                        }
                        if (declarator.id.name === '$addressSize') {
                            declarator.init = {
                                type: 'Literal',
                                value: addressSize * 8
                            };
                            return node;
                        }
                    }
                }
            }
        }
    });
};
//# sourceMappingURL=transform-lib.js.map