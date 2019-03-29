"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const util_1 = require("../util");
exports.getSubroutineNames = (program) => {
    const functionVisitor = {
        enter: (node, parent) => {
            if (node.type !== 'FunctionDeclaration')
                return;
            if (parent && !allowedFunctionParents.includes(parent.type))
                throw util_1.LocError(`Functions cannot be nested in ${parent.type}`, node);
            const name = node.id.name;
            if (subroutineNames.has(name) || exportNames.has(name))
                throw util_1.LocError(`Duplicate function name ${name}`, node);
            if (parent.type === 'Program')
                subroutineNames.add(name);
            if (parent.type === 'ExportNamedDeclaration')
                exportNames.add(name);
        }
    };
    const subroutineNames = new Set();
    const exportNames = new Set();
    estraverse_1.traverse(program, functionVisitor);
    const subroutines = Array.from(subroutineNames);
    const exports = Array.from(exportNames);
    return { subroutines, exports };
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
const allowedFunctionParents = [
    'Program', 'ExportNamedDeclaration'
];
exports.getAllNames = (functionNames) => [
    ...functionNames.subroutines,
    ...functionNames.exports,
    ...functionNames.external
];
//# sourceMappingURL=util.js.map