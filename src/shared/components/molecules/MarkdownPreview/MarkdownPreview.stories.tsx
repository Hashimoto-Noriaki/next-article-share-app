import type { Meta, StoryObj } from '@storybook/nextjs';
import { MarkdownPreview } from './MarkdownPreview';

const meta: Meta<typeof MarkdownPreview> = {
  title: 'Shared/Molecules/MarkdownPreview',
  component: MarkdownPreview,
  decorators: [
    (Story) => (
      <div className="w-[600px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MarkdownPreview>;

export const Default: Story = {
  args: {
    content: '# 見出し\n\nこれは本文です。',
  },
};

export const Empty: Story = {
  args: {
    content: '',
  },
};

export const WithList: Story = {
  args: {
    content: `# リストの例

## 箇条書き
- 項目1
- 項目2
- 項目3

## 番号付き
1. 最初
2. 次
3. 最後
`,
  },
};

export const WithCode: Story = {
  args: {
    content: `# コードの例

インラインコード: \`const x = 1;\`

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`
`,
  },
};

export const FullExample: Story = {
  args: {
    content: `# 技術ブログ記事

## はじめに

この記事では**Markdown**の書き方を紹介します。

## リスト

- React
- Next.js
- TypeScript

## コード

\`\`\`typescript
const greeting: string = 'Hello';
console.log(greeting);
\`\`\`

## リンク

[Anthropic](https://anthropic.com)
`,
  },
};
