"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esprima_1 = require("esprima");
const estraverse_1 = require("estraverse");
exports.buildLib = (libAst, maxSize, addressSize) => {
    const callStackAst = esprima_1.parseScript(`
    const { $in, $out } = $CallStack( ${maxSize}, ${addressSize} )
  `);
    estraverse_1.replace(libAst, {
        enter: (node, parent) => {
            if (node.type === 'AssignmentExpression' &&
                node.left.type === 'MemberExpression' &&
                node.left.object.type === 'Identifier' &&
                node.left.object.name === 'exports' &&
                node.left.property.type === 'Identifier') {
                const variableDeclarator = {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: node.left.property.name
                    },
                    init: node.right
                };
                const variableDeclaration = {
                    type: 'VariableDeclaration',
                    kind: 'const',
                    declarations: [variableDeclarator]
                };
                return variableDeclaration;
            }
            else if (parent &&
                parent.type !== 'AssignmentExpression' &&
                node.type === 'MemberExpression' &&
                node.object.type === 'Identifier' &&
                node.object.name === 'exports' &&
                node.property.type === 'Identifier') {
                return node.property;
            }
            return node;
        }
    });
    const [useStrict, , ...rest] = libAst.body;
    libAst.body = [
        useStrict,
        ...rest,
        ...callStackAst.body
    ];
    return libAst.body;
};
//# sourceMappingURL=build-lib.js.map