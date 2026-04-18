'use strict';

// client層 (features/{feature}/hooks/, features/{feature}/components/client/) から
// service層 (external/handler/, external/repository/) への直接importを禁止する。
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
        'client層から service層（external/handler, external/repository）への直接importを禁止します。Server Actions経由でアクセスしてください。',
    },
    schema: [],
    messages: {
      noServiceImport:
        'client層から service層 "{{importPath}}" への直接importは禁止です。Server Actions（features/*/actions）経由でアクセスしてください。',
    },
  },

  create(context) {
    const filePath = context.getFilename();

    const CLIENT_LAYER_PATTERN =
      /\/features\/[^/]+\/(?:hooks|components\/client)\//;

    if (!CLIENT_LAYER_PATTERN.test(filePath)) {
      return {};
    }

    const SERVICE_LAYER_PATTERNS = [
      /^@\/external\/handler\//,
      /^@\/external\/repository\//,
      /\.server$/,
      /\.server['"]/, // 念のため拡張子あり形式もカバー
    ];

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        const isServiceLayerImport = SERVICE_LAYER_PATTERNS.some((pattern) =>
          pattern.test(importPath),
        );

        if (isServiceLayerImport) {
          context.report({
            node,
            messageId: 'noServiceImport',
            data: { importPath },
          });
        }
      },
    };
  },
};
