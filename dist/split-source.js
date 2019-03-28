"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
exports.splitSource = (program) => {
    const yukiDeclarations = {
        type: 'Program',
        body: [],
        sourceType: 'script'
    };
    const yukiMain = {
        type: 'Program',
        body: [],
        sourceType: 'module'
    };
    let isDeclaration = true;
    program.body.forEach(node => {
        isDeclaration = isDeclaration && node.type === 'VariableDeclaration';
        if (isDeclaration) {
            yukiDeclarations.body.push(node);
            return;
        }
        if (node.type === 'VariableDeclaration')
            throw util_1.LocError('Unexpected VariableDeclaration', node);
        yukiMain.body.push(node);
    });
    return { yukiDeclarations, yukiMain };
};
//# sourceMappingURL=split-source.js.map