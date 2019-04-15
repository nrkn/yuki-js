"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const esprima_1 = require("esprima");
const createTypeFactories = () => {
    const declarations = [];
    for (let i = 2; i <= 32; i++) {
        const int = createTypeFactory(`Int${i}`, 'IntFactory', i);
        const uint = createTypeFactory(`Uint${i}`, 'UintFactory', i);
        const intArr = createTypeFactory(`Int${i}Arr`, 'IntArrayFactory', i);
        const uintArr = createTypeFactory(`Uint${i}Arr`, 'UintArrayFactory', i);
        declarations.push(int);
        declarations.push(uint);
        declarations.push(intArr);
        declarations.push(uintArr);
    }
    return declarations;
};
const createTypeFactory = (name, factoryName, bitLength) => {
    const declaration = {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name
                },
                init: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: factoryName
                    },
                    arguments: [
                        {
                            type: 'Literal',
                            value: bitLength,
                        }
                    ]
                }
            }
        ],
        kind: 'const'
    };
    return declaration;
};
const typeSource = fs_1.readFileSync('./lib/types/index.js', 'utf8');
const libSource = fs_1.readFileSync('./lib/index.js', 'utf8');
const typeAst = esprima_1.parseScript(typeSource);
const libAst = esprima_1.parseScript(libSource);
const ast = {
    type: 'Program',
    body: [
        ...typeAst.body,
        ...createTypeFactories(),
        ...libAst.body
    ],
    sourceType: 'script'
};
const json = JSON.stringify(ast, null, 2);
fs_1.writeFileSync('./src/lib/lib.json', json, 'utf8');
//# sourceMappingURL=build-lib.js.map