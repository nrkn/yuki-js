"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const util_1 = require("../util");
exports.getSubroutineNames = (program) => {
    const functionVisitor = {
        enter: (node, parent) => {
            if (node.type !== 'FunctionDeclaration')
                return;
            if (parent && parent.type !== 'Program')
                throw util_1.LocError(`Functions cannot be nested in ${parent.type}`, node);
            const name = node.id.name;
            if (subroutineNames.has(name))
                throw util_1.LocError(`Duplicate function name ${name}`, node);
            subroutineNames.add(name);
        }
    };
    const subroutineNames = new Set();
    estraverse_1.traverse(program, functionVisitor);
    const subroutines = Array.from(subroutineNames);
    return { subroutines };
};
exports.getLibFunctionNames = (program) => {
    const functionVisitor = {
        enter: (node, parent) => {
            if (node.type !== 'FunctionDeclaration')
                return;
            const name = node.id.name;
            if (functionNames.has(name))
                throw util_1.LocError(`Duplicate function name ${name}`, node);
            if (parent.type === 'Program' && !name.startsWith('$'))
                functionNames.add(name);
        }
    };
    const functionNames = new Set();
    estraverse_1.traverse(program, functionVisitor);
    return Array.from(functionNames);
};
exports.getAllNames = (functionNames) => [
    ...functionNames.subroutines,
    ...functionNames.external
];
//# sourceMappingURL=util.js.map