"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
exports.replaceMainProgram = (program, lets) => {
    program = JSON.parse(JSON.stringify(program));
    const map = new Map();
    lets.forEach(l => map.set(l.name, l));
    const visitor = {
        enter: (node, parent) => {
            if (node.type === 'Identifier' && map.has(node.name)) {
                if (node.name === '$')
                    return node;
                if (parent &&
                    parent.type === 'MemberExpression' &&
                    parent.object.type === 'Identifier' &&
                    parent.object.name === '$')
                    return node;
                return replaceIdentifier(node);
            }
            if (node.type === 'ReturnStatement' && !node.argument) {
                return replaceReturn(node);
            }
            if (node.type === 'FunctionDeclaration') {
                return replaceFunction(node);
            }
            return node;
        }
    };
    estraverse_1.replace(program, visitor);
    return program;
};
const replaceIdentifier = (node) => {
    const { name } = node;
    const expression = {
        type: 'MemberExpression',
        computed: false,
        object: {
            type: 'Identifier',
            name: '$'
        },
        property: {
            type: 'Identifier',
            name
        }
    };
    return expression;
};
const replaceFunction = (node) => {
    node = JSON.parse(JSON.stringify(node));
    node.body.body = [
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "$in"
                },
                "arguments": []
            }
        },
        ...node.body.body,
        returnStatement()
    ];
    return node;
};
const replaceReturn = (_node) => returnStatement();
const returnStatement = () => ({
    type: 'ReturnStatement',
    argument: {
        type: 'CallExpression',
        callee: {
            type: 'Identifier',
            name: '$out'
        },
        arguments: []
    }
});
//# sourceMappingURL=replace.js.map