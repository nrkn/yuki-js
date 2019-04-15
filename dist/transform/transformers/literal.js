"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_predicates_1 = require("../node-predicates");
const utils_1 = require("../utils");
exports.literalNode = (node) => {
    if (!node_predicates_1.isPreYukiLiteral(node))
        throw utils_1.LocError('Expected number or boolean', node);
    if (typeof node.value === 'boolean') {
        node.value = node.value ? 1 : 0;
        node.raw = String(node.value);
        return node;
    }
};
//# sourceMappingURL=literal.js.map