import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { MarkdownEditor } from './MarkdownEditor';

const meta: Meta<typeof MarkdownEditor> = {
  title: 'Features/Articles/MarkdownEditor',
  component: MarkdownEditor,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-gray-50 min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

// インタラクティブに動作させるためのラッパー
const MarkdownEditorWrapper = (
  args: React.ComponentProps<typeof MarkdownEditor>,
) => {
  const [title, setTitle] = useState(args.title);
  const [tags, setTags] = useState(args.tags);
  const [body, setBody] = useState(args.body);

  return (
    <MarkdownEditor
      {...args}
      title={title}
      onTitleChange={setTitle}
      tags={tags}
      onTagsChange={setTags}
      body={body}
      onBodyChange={setBody}
    />
  );
};

export const Default: Story = {
  render: (args) => <MarkdownEditorWrapper {...args} />,
  args: {
    title: '',
    tags: '',
    body: '',
  },
};

export const WithContent: Story = {
  render: (args) => <MarkdownEditorWrapper {...args} />,
  args: {
    title: 'Next.js App Routerの使い方',
    tags: 'Next.js React TypeScript',
    body: `# はじめに

この記事ではNext.js App Routerについて解説します。

## 特徴

- Server Components対応
- ファイルベースルーティング
- レイアウト機能

\`\`\`typescript
export default function Page() {
  return <div>Hello World</div>;
}
\`\`\`
`,
  },
};

export const WithErrors: Story = {
  render: (args) => <MarkdownEditorWrapper {...args} />,
  args: {
    title: '',
    tags: 'tag1 tag2 tag3 tag4 tag5 tag6',
    body: '',
    errors: {
      title: 'タイトルは必須です',
      tags: 'タグは5つまでです',
      content: '本文は必須です',
    },
  },
};
