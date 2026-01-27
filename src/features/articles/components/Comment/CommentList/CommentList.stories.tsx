import type { Meta, StoryObj } from '@storybook/nextjs';
import { CommentList } from './CommentList';

const meta: Meta<typeof CommentList> = {
  title: 'Features/Articles/Comment/CommentList',
  component: CommentList,
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommentList>;

export const Default: Story = {
  args: {
    articleId: '1',
    currentUserId: '1',
    comments: [
      {
        id: '1',
        content: 'とても参考になりました！',
        articleId: '1',
        userId: '2',
        createdAt: '2026-01-01T00:00:00Z',
        user: { id: '2', name: 'ユーザーA' },
      },
      {
        id: '2',
        content: '自分のコメントです。',
        articleId: '1',
        userId: '1',
        createdAt: '2026-01-02T00:00:00Z',
        user: { id: '1', name: '自分' },
      },
      {
        id: '3',
        content: '素晴らしい記事ですね！',
        articleId: '1',
        userId: '3',
        createdAt: '2026-01-03T00:00:00Z',
        user: { id: '3', name: 'ユーザーB' },
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    articleId: '1',
    currentUserId: '1',
    comments: [],
  },
};

export const SingleComment: Story = {
  args: {
    articleId: '1',
    currentUserId: '1',
    comments: [
      {
        id: '1',
        content: '最初のコメントです。',
        articleId: '1',
        userId: '2',
        createdAt: '2026-01-01T00:00:00Z',
        user: { id: '2', name: 'ユーザーA' },
      },
    ],
  },
};
