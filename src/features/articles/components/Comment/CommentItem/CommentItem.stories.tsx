import type { Meta, StoryObj } from '@storybook/nextjs';
import { CommentItem } from './CommentItem';

const meta: Meta<typeof CommentItem> = {
  title: 'Features/Articles/CommentItem',
  component: CommentItem,
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

export const Default: Story = {
  args: {
    id: '1',
    content: 'とても参考になりました！',
    articleId: '1',
    userId: '1',
    userName: 'テストユーザー',
    createdAt: '2026-01-01T00:00:00Z',
    isOwner: false,
  },
};

export const AsOwner: Story = {
  args: {
    id: '1',
    content: '自分のコメントです。編集・削除ができます。',
    articleId: '1',
    userId: '1',
    userName: '自分',
    createdAt: '2026-01-15T00:00:00Z',
    isOwner: true,
  },
};

export const LongComment: Story = {
  args: {
    id: '1',
    content: 'これはとても長いコメントです。\n\n改行も含まれています。\n\nNext.jsのApp Routerについて詳しく解説されていて、とても勉強になりました。特にServer Componentsの部分が分かりやすかったです。',
    articleId: '1',
    userId: '1',
    userName: 'テストユーザー',
    createdAt: '2026-01-10T00:00:00Z',
    isOwner: false,
  },
};