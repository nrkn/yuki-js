"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const esprima_1 = require("esprima");
const transform_1 = require("../transform");
const node_predicates_1 = require("../transform/node-predicates");
const scope_1 = require("../transform/scope");
const default_options_1 = require("../transform/default-options");
describe('yuki-js', () => {
    describe('transform', () => {
        describe('transform', () => {
            it('Unexpected type', () => {
                const source = 'class x{}';
                const program = esprima_1.parseScript(source);
                assert.throws(() => transform_1.transform(program), {
                    message: 'Unexpected type ClassDeclaration'
                });
            });
            it('LocError', () => {
                const source = 'class x{}';
                const program = esprima_1.parseScript(source, { loc: true });
                assert.throws(() => transform_1.transform(program), {
                    message: 'Unexpected type ClassDeclaration at line 1, column 0'
                });
            });
        });
        describe('predicates', () => {
            it('isFreezeCallExpression', () => {
                assert(!node_predicates_1.isFreezeCallExpression({ type: 'Literal', value: 10 }));
            });
            it('isFreezeMemberExpression ', () => {
                assert(!node_predicates_1.isFreezeMemberExpression({ type: 'Literal', value: 10 }));
            });
        });
        describe('scope', () => {
            const scope = {
                type: 'global',
                consts: [],
                numbers: ['foo'],
                arrays: [],
                functions: []
            };
            describe('existsLocal', () => {
                it('has number', () => {
                    assert(scope_1.existsLocal(scope, 'foo', 'numbers'));
                });
            });
            describe('existsGlobal', () => {
                it('has number', () => {
                    assert(scope_1.existsGlobal(scope, 'foo'));
                });
            });
            describe('exitScope', () => {
                it('cannot exit parent', () => {
                    const options = default_options_1.DefaultTransformOptions();
                    assert.throws(() => scope_1.exitScope(options), {
                        message: 'No scope to exit!'
                    });
                });
            });
            describe('countScopeDepthTo', () => {
                it('has no parent', () => {
                    const depth = scope_1.countScopeDepthTo(scope, 'function');
                    assert.strictEqual(depth, -1);
                });
            });
        });
    });
});
//# sourceMappingURL=transform.js.map