"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const utils_1 = require("./utils");
const node_predicates_1 = require("./node-predicates");
const default_options_1 = require("./default-options");
const scope_1 = require("./scope");
const expression_to_block_1 = require("./transformers/expression-to-block");
const transformers_1 = require("./transformers");
exports.transform = (ast, options = default_options_1.DefaultTransformOptions()) => {
    ast = JSON.parse(JSON.stringify(ast));
    // first, turn expressions into blocks
    const preVisitor = {
        enter: expression_to_block_1.expressionToBlock,
        leave: node => {
            // block to contain potential VariableDeclaration in init
            if (node.type === 'ForStatement') {
                return expression_to_block_1.makeBlock(node);
            }
        }
    };
    ast = estraverse_1.replace(ast, preVisitor);
    const visitor = {
        enter: (node, parent) => {
            if (!node_predicates_1.isYukiNode(node))
                throw utils_1.LocError(`Unexpected type ${node.type}`, node);
            if (node.type === 'BlockStatement') {
                const parentType = parent.type;
                let scopeType = 'block';
                if (parentType === 'FunctionDeclaration') {
                    scopeType = 'function';
                }
                else if (parentType === 'ForStatement' ||
                    parentType === 'WhileStatement' ||
                    parentType === 'DoWhileStatement') {
                    scopeType = 'loop';
                }
                scope_1.enterScope(options, scopeType);
            }
            if (node.type in transformers_1.transformers) {
                return transformers_1.transformers[node.type](node, parent, options);
            }
        },
        leave: node => {
            if (node.type === 'BlockStatement') {
                scope_1.exitScope(options);
            }
        }
    };
    return estraverse_1.replace(ast, visitor);
};
//# sourceMappingURL=index.js.map