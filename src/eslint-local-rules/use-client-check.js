'use strict';

// 'use client' の配置ルール:
//   1. 先頭以外（import 後など）への記述は禁止
//   2. Server Actions（features/*/actions/）への記述は禁止
//   3. クライアント層（hooks/, components/client/）には必須
//   4. app/**/page.tsx への記述は禁止（app/ を薄く保つ。.claude/rules/architecture.md）
//
// クライアント層の定義:
//   features/{feature}/hooks/
//   features/{feature}/components/client/
//   shared/hooks/

const CLIENT_LAYER_DEFS = [
  { pattern: /\/features\/[^/]+\/hooks\//, label: 'features/*/hooks/' },
  {
    pattern: /\/features\/[^/]+\/components\/client\//,
    label: 'features/*/components/client/',
  },
  { pattern: /\/shared\/hooks\//, label: 'shared/hooks/' },
];

const ACTION_FILE_PATTERN = /\/features\/[^/]+\/actions\//;
const APP_PAGE_PATTERN = /\/app\/(.+\/)?page\.tsx$/;
const TEST_FILE_PATTERN = /\.(spec|test)\.(ts|tsx|js|jsx)$/;
const TYPE_DEF_PATTERN = /\.d\.ts$/;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "'use client' ディレクティブの配置を検証します。",
    },
    schema: [],
    messages: {
      misplacedDirective:
        "'use client' はファイルの先頭（他のステートメントより前）に記述してください。",
      forbiddenInActions:
        "Server Actions ファイル（features/*/actions/）に 'use client' を記述することはできません。",
      forbiddenInAppPage:
        "app/**/page.tsx に 'use client' を記述することはできません。フォームや状態を持つ UI は features/*/components/client/ に移してください。",
      requiredInClientLayer:
        "{{label}} のファイルには 'use client' ディレクティブが必要です。",
    },
  },

  create(context) {
    const filePath = context.filename ?? context.getFilename();

    if (TEST_FILE_PATTERN.test(filePath) || TYPE_DEF_PATTERN.test(filePath)) {
      return {};
    }

    const isActionFile = ACTION_FILE_PATTERN.test(filePath);
    const isAppPage = APP_PAGE_PATTERN.test(filePath);
    const matchedClientDef = CLIENT_LAYER_DEFS.find(({ pattern }) =>
      pattern.test(filePath),
    );

    return {
      Program(node) {
        const body = node.body;

        const useClientIndex = body.findIndex(
          (stmt) =>
            stmt.type === 'ExpressionStatement' &&
            stmt.expression.type === 'Literal' &&
            stmt.expression.value === 'use client',
        );
        const hasUseClient = useClientIndex !== -1;

        // Server Actions に 'use client' は禁止
        if (isActionFile && hasUseClient) {
          context.report({
            node: body[useClientIndex],
            messageId: 'forbiddenInActions',
          });
          return;
        }

        // app/**/page.tsx に 'use client' は禁止
        if (isAppPage && hasUseClient) {
          context.report({
            node: body[useClientIndex],
            messageId: 'forbiddenInAppPage',
          });
          return;
        }

        // 'use client' が先頭以外にある場合はエラー
        if (hasUseClient && useClientIndex !== 0) {
          context.report({
            node: body[useClientIndex],
            messageId: 'misplacedDirective',
          });
        }

        // re-export のみのバレルファイルはスキップ
        const isBarrelFile = body.every(
          (stmt) =>
            (stmt.type === 'ExportNamedDeclaration' && stmt.source !== null) ||
            stmt.type === 'ExportAllDeclaration',
        );

        // クライアント層には 'use client' が必須（バレルファイルを除く）
        if (matchedClientDef && !hasUseClient && !isBarrelFile) {
          context.report({
            node,
            messageId: 'requiredInClientLayer',
            data: { label: matchedClientDef.label },
          });
        }
      },
    };
  },
};
