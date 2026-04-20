'use strict';

// Server Actions（features/{feature}/actions/）は
// client層（features/{feature}/hooks/, features/{feature}/components/client/,
//          shared/hooks/, 'use client' ディレクティブを持つファイル）
// からのみ import を許可する。
//
// 正しい依存方向:
//   components/client, hooks
//     → features/{feature}/actions  (Server Actions)
//       → external/handler
//         → external/repository

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Server Actions（features/*/actions）は client層（hooks / components/client / "use client" ファイル）からのみ import できます。',
    },
    schema: [],
    messages: {
      noActionImport:
        '"{{importPath}}" は Server Action です。import できるのは hooks/, components/client/, または "use client" ディレクティブを持つファイルのみです。',
    },
  },

  create(context) {
    const filePath = context.getFilename();

    const ACTION_IMPORT_PATTERN = /^@\/features\/[^/]+\/actions\//;

    const ALLOWED_FILE_PATTERNS = [
      /\/features\/[^/]+\/hooks\//,
      /\/features\/[^/]+\/components\/client\//,
      /\/shared\/hooks\//,
    ];

    const isAllowedByPath = ALLOWED_FILE_PATTERNS.some((pattern) =>
      pattern.test(filePath),
    );

    // Program は ImportDeclaration より先に訪問されるため、
    // ここで 'use client' を検出してフラグを立てる
    let hasUseClientDirective = false;

    return {
      Program(node) {
        hasUseClientDirective = node.body.some(
          (statement) =>
            statement.type === 'ExpressionStatement' &&
            statement.expression.type === 'Literal' &&
            statement.expression.value === 'use client',
        );
      },

      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (!ACTION_IMPORT_PATTERN.test(importPath)) {
          return;
        }

        if (isAllowedByPath || hasUseClientDirective) {
          return;
        }

        context.report({
          node,
          messageId: 'noActionImport',
          data: { importPath },
        });
      },
    };
  },
};
