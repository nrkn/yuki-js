"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            throw Error('Unexpected VariableDeclaration');
        yukiMain.body.push(node);
    });
    return { yukiDeclarations, yukiMain };
};
//# sourceMappingURL=split-source.js.map