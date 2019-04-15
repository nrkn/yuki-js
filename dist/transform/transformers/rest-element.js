"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.restElementNode = (node, parent) => {
    if (parent.type === 'FunctionDeclaration' &&
        node.argument.type === 'Identifier' &&
        node.argument.name === '$args')
        return;
    throw utils_1.LocError('Unexpected type RestElement', node);
};
//# sourceMappingURL=rest-element.js.map