import { Node } from 'estree';
import { YukiNode, PreYukiLiteral, YukiLiteral, YukiConstDeclaration, YukiConstDeclarator, YukiConstArrayExpression, YukiCallExpressionDeclarator, YukiLetDeclarator, YukiLetDeclaration, YukiParam, YukiUnaryExpression, FreezeCallExpression, FreezeMemberExpression } from './node-types';
export declare const isYukiNode: (node?: import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").Program | import("estree").FunctionDeclaration | import("estree").FunctionExpression | import("estree").ArrowFunctionExpression | import("estree").SwitchCase | import("estree").CatchClause | import("estree").VariableDeclarator | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").ClassDeclaration | import("estree").ThisExpression | import("estree").ArrayExpression | import("estree").ObjectExpression | import("estree").YieldExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").BinaryExpression | import("estree").AssignmentExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").ConditionalExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").SequenceExpression | import("estree").TemplateLiteral | import("estree").TaggedTemplateExpression | import("estree").ClassExpression | import("estree").MetaProperty | import("estree").AwaitExpression | import("estree").Property | import("estree").AssignmentProperty | import("estree").Super | import("estree").TemplateElement | import("estree").SpreadElement | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").ClassBody | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier | null | undefined) => node is YukiNode;
export declare const isPreYukiLiteral: (node?: import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").Program | import("estree").FunctionDeclaration | import("estree").FunctionExpression | import("estree").ArrowFunctionExpression | import("estree").SwitchCase | import("estree").CatchClause | import("estree").VariableDeclarator | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").ClassDeclaration | import("estree").ThisExpression | import("estree").ArrayExpression | import("estree").ObjectExpression | import("estree").YieldExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").BinaryExpression | import("estree").AssignmentExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").ConditionalExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").SequenceExpression | import("estree").TemplateLiteral | import("estree").TaggedTemplateExpression | import("estree").ClassExpression | import("estree").MetaProperty | import("estree").AwaitExpression | import("estree").Property | import("estree").AssignmentProperty | import("estree").Super | import("estree").TemplateElement | import("estree").SpreadElement | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").ClassBody | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier | null | undefined) => node is PreYukiLiteral;
export declare const isYukiLiteral: (node: Node) => node is YukiLiteral;
export declare const isYukiConstArrayExpression: (node?: import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").Program | import("estree").FunctionDeclaration | import("estree").FunctionExpression | import("estree").ArrowFunctionExpression | import("estree").SwitchCase | import("estree").CatchClause | import("estree").VariableDeclarator | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").ClassDeclaration | import("estree").ThisExpression | import("estree").ArrayExpression | import("estree").ObjectExpression | import("estree").YieldExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").BinaryExpression | import("estree").AssignmentExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").ConditionalExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").SequenceExpression | import("estree").TemplateLiteral | import("estree").TaggedTemplateExpression | import("estree").ClassExpression | import("estree").MetaProperty | import("estree").AwaitExpression | import("estree").Property | import("estree").AssignmentProperty | import("estree").Super | import("estree").TemplateElement | import("estree").SpreadElement | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").ClassBody | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier | null | undefined) => node is YukiConstArrayExpression;
export declare const isYukiConstDeclarator: (node: Node) => node is YukiConstDeclarator;
export declare const isYukiConstDeclaration: (node: Node) => node is YukiConstDeclaration;
export declare const isYukiCallExpressionDeclarator: (node?: import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").Program | import("estree").FunctionDeclaration | import("estree").FunctionExpression | import("estree").ArrowFunctionExpression | import("estree").SwitchCase | import("estree").CatchClause | import("estree").VariableDeclarator | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").ClassDeclaration | import("estree").ThisExpression | import("estree").ArrayExpression | import("estree").ObjectExpression | import("estree").YieldExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").BinaryExpression | import("estree").AssignmentExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").ConditionalExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").SequenceExpression | import("estree").TemplateLiteral | import("estree").TaggedTemplateExpression | import("estree").ClassExpression | import("estree").MetaProperty | import("estree").AwaitExpression | import("estree").Property | import("estree").AssignmentProperty | import("estree").Super | import("estree").TemplateElement | import("estree").SpreadElement | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").ClassBody | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier | null | undefined) => node is YukiCallExpressionDeclarator;
export declare const isYukiLetDeclarator: (node: Node) => node is YukiLetDeclarator;
export declare const isYukiLetDeclaration: (node: Node) => node is YukiLetDeclaration;
export declare const isYukiParam: (node: Node) => node is YukiParam;
export declare const isYukiParamList: (nodes: Node[]) => nodes is YukiParam[];
export declare const isYukiUnaryExpression: (node?: import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").Program | import("estree").FunctionDeclaration | import("estree").FunctionExpression | import("estree").ArrowFunctionExpression | import("estree").SwitchCase | import("estree").CatchClause | import("estree").VariableDeclarator | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").ClassDeclaration | import("estree").ThisExpression | import("estree").ArrayExpression | import("estree").ObjectExpression | import("estree").YieldExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").BinaryExpression | import("estree").AssignmentExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").ConditionalExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").SequenceExpression | import("estree").TemplateLiteral | import("estree").TaggedTemplateExpression | import("estree").ClassExpression | import("estree").MetaProperty | import("estree").AwaitExpression | import("estree").Property | import("estree").AssignmentProperty | import("estree").Super | import("estree").TemplateElement | import("estree").SpreadElement | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").ClassBody | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier | null | undefined) => node is YukiUnaryExpression;
export declare const isYukiConstUnaryExpression: (node?: import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").Program | import("estree").FunctionDeclaration | import("estree").FunctionExpression | import("estree").ArrowFunctionExpression | import("estree").SwitchCase | import("estree").CatchClause | import("estree").VariableDeclarator | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").ClassDeclaration | import("estree").ThisExpression | import("estree").ArrayExpression | import("estree").ObjectExpression | import("estree").YieldExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").BinaryExpression | import("estree").AssignmentExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").ConditionalExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").SequenceExpression | import("estree").TemplateLiteral | import("estree").TaggedTemplateExpression | import("estree").ClassExpression | import("estree").MetaProperty | import("estree").AwaitExpression | import("estree").Property | import("estree").AssignmentProperty | import("estree").Super | import("estree").TemplateElement | import("estree").SpreadElement | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").ClassBody | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier | null | undefined) => node is YukiUnaryExpression;
export declare const isFreezeCallExpression: (node: Node) => node is FreezeCallExpression;
export declare const isFreezeMemberExpression: (node: Node) => node is FreezeMemberExpression;