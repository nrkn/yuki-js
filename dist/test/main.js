"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const esprima_1 = require("esprima");
const validate_1 = require("../main/validate");
describe('yuki-js', () => {
    describe('main', () => {
        describe('validate', () => {
            const headerMap = new Map();
            const functionNames = {
                external: [],
                subroutines: [],
                exports: []
            };
            describe('ValidateNode', () => {
                const validateNode = validate_1.ValidateNode(headerMap, functionNames);
                it('Unexpected type VariableDeclaration', () => {
                    const ast = esprima_1.parseScript('let x = 0');
                    const node = ast.body[0];
                    const errors = validateNode(node);
                    assert.strictEqual(errors.length, 1);
                    assert(errors[0].message.startsWith('Unexpected type VariableDeclaration'));
                });
            });
            describe('ValidateIdentifier', () => {
                it('Unexpected Identifier a', () => {
                    const validateIdentifier = validate_1.ValidateIdentifier(headerMap, []);
                    const ast = esprima_1.parseScript('a');
                    const expression = ast.body[0];
                    const identifier = expression.expression;
                    const errors = validateIdentifier(identifier);
                    assert.strictEqual(errors.length, 1);
                    assert(errors[0].message.startsWith('Unexpected Identifier a'));
                });
            });
            describe('ValidateMemberExpression', () => {
                const headerMap = new Map();
                const a = {
                    name: 'a',
                    valueType: 'let',
                    type: 'number',
                    bitLength: 8,
                    signed: true
                };
                headerMap.set('a', a);
                const validateMemberExpression = validate_1.ValidateMemberExpression(headerMap);
                const validate = (errorMessage, source) => {
                    it(errorMessage, () => {
                        const ast = esprima_1.parseScript(source);
                        const expression = ast.body[0];
                        const memberExpression = expression.expression;
                        const errors = validateMemberExpression(memberExpression);
                        assert.strictEqual(errors.length, 1);
                        assert(errors[0].message.startsWith(errorMessage));
                    });
                };
                validate('Unexpected type ArrayExpression', '[ 1, 2, 3 ][ 0 ]');
                validate('Unexpected name b', 'b[ 0 ]');
                validate('Unexpected number a', 'a[ 0 ]');
            });
            describe('ValidateAssignmentExpression', () => {
                const headerMap = new Map();
                const a = {
                    name: 'a',
                    valueType: 'let',
                    type: 'number',
                    bitLength: 8,
                    signed: true
                };
                const b = {
                    name: 'b',
                    valueType: 'let',
                    type: 'array',
                    bitLength: 8,
                    signed: true,
                    length: 10
                };
                const c = {
                    name: 'c',
                    valueType: 'const',
                    type: 'number',
                    value: 10
                };
                const d = {
                    name: 'd',
                    valueType: 'const',
                    type: 'array',
                    value: [1, 2, 3]
                };
                headerMap.set('a', a);
                headerMap.set('b', b);
                headerMap.set('c', c);
                headerMap.set('d', d);
                const validateMemberExpression = validate_1.ValidateMemberExpression(headerMap);
                const validateIdentifier = validate_1.ValidateIdentifier(headerMap, ['foo']);
                const validateAssignmentExpression = validate_1.ValidateAssignmentExpression(headerMap, validateIdentifier, validateMemberExpression);
                const validate = (errorMessage, source) => {
                    it(errorMessage, () => {
                        const ast = esprima_1.parseScript(source);
                        const expression = ast.body[0];
                        const assignmentExpression = (expression.expression);
                        const errors = validateAssignmentExpression(assignmentExpression);
                        assert.strictEqual(errors.length, 1);
                        assert(errors[0].message.startsWith(errorMessage));
                    });
                };
                validate('Expected Identifier or MemberExpression', '[ a, b ] = c');
                validate('Unexpected Identifier e', 'e = a');
                validate('Unexpected assignment to foo', 'foo = a');
                validate('Unexpected assignment to array', 'b = a');
                validate('Unexpected assignment to const', 'c = a');
                validate('Unexpected type ArrayExpression', '[ 1, 2, 3 ][ 0 ] = a');
                validate('Unexpected assignment to const', 'd[ 0 ] = a');
            });
            describe('ValidateCallExpression', () => {
                const functionNames = {
                    external: ['foo'],
                    subroutines: ['bar'],
                    exports: ['baz']
                };
                const validateCallExpression = validate_1.ValidateCallExpression(functionNames);
                const validate = (errorMessage, source) => {
                    it(errorMessage, () => {
                        const ast = esprima_1.parseScript(source);
                        const expression = ast.body[0];
                        const callExpression = (expression.expression);
                        const errors = validateCallExpression(callExpression);
                        assert.strictEqual(errors.length, 1);
                        assert(errors[0].message.startsWith(errorMessage));
                    });
                };
                validate('Expected Identifier', 'a[ 0 ]()');
                validate('Unexpected arguments', 'bar( 1 )');
                validate('Unexpected Identifier qux', 'qux()');
            });
            describe('validateFunctionDeclaration', () => {
                it('Unexpected params', () => {
                    const ast = esprima_1.parseScript('function a( b ){}');
                    const declaration = ast.body[0];
                    const errors = validate_1.validateFunctionDeclaration(declaration);
                    assert(errors[0].message.startsWith('Unexpected params'));
                });
            });
            describe('validateExportNamedDeclaration', () => {
                it('Unexpected type VariableDeclaration', () => {
                    const ast = esprima_1.parseModule('export const a = 10');
                    const declaration = ast.body[0];
                    const errors = validate_1.validateExportNamedDeclaration(declaration);
                    assert(errors[0].message.startsWith('Unexpected type VariableDeclaration'));
                });
            });
            describe('validateReturnStatement', () => {
                it('Unexpected argument', () => {
                    const ast = esprima_1.parseScript('function a(){ return a }');
                    const declaration = ast.body[0];
                    const statement = declaration.body.body[0];
                    const errors = validate_1.validateReturnStatement(statement);
                    assert(errors[0].message.startsWith('Unexpected argument'));
                });
            });
            describe('validateLiteral', () => {
                it('Unexpected type string', () => {
                    const ast = esprima_1.parseScript('""');
                    const expression = ast.body[0];
                    const literal = expression.expression;
                    const errors = validate_1.validateLiteral(literal);
                    assert(errors[0].message.startsWith('Unexpected type string'));
                });
            });
        });
    });
});
//# sourceMappingURL=main.js.map