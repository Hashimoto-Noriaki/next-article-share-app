import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArticleCard } from './ArticleCard';

const meta: Meta<typeof ArticleCard> = {
  title: 'Features/Articles/ArticleCard',
  component: ArticleCard,
};

export default meta;
type Story = StoryObj<typeof ArticleCard>;

export const Default: Story = {
  args: {
    id: '1',
    title: 'Next.js App Routerの使い方',
    tags: ['Next.js', 'React', 'TypeScript'],
    authorName: 'テストユーザー',
    createdAt: new Date('2026-01-01'),
    likeCount: 10,
    isLiked: false,
    isAuthor: false,
    isLoggedIn: false,
  },
};

export const LoggedIn: Story = {
  args: {
    id: '1',
    title: 'Next.js App Routerの使い方',
    tags: ['Next.js', 'React', 'TypeScript'],
    authorName: 'テストユーザー',
    createdAt: new Date('2026-01-01'),
    likeCount: 10,
    isLiked: false,
    isAuthor: false,
    isLoggedIn: true,
  },
};

export const Liked: Story = {
  args: {
    id: '1',
    title: 'Next.js App Routerの使い方',
    tags: ['Next.js', 'React', 'TypeScript'],
    authorName: 'テストユーザー',
    createdAt: new Date('2026-01-01'),
    likeCount: 11,
    isLiked: true,
    isAuthor: false,
    isLoggedIn: true,
  },
};

export const AsAuthor: Story = {
  args: {
    id: '1',
    title: '自分が書いた記事',
    tags: ['Next.js', 'React'],
    authorName: '自分',
    createdAt: new Date('2026-01-01'),
    likeCount: 5,
    isLiked: false,
    isAuthor: true,
    isLoggedIn: true,
  },
};

export const Updated: Story = {
  args: {
    id: '1',
    title: '更新された記事',
    tags: ['Next.js'],
    authorName: 'テストユーザー',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-15'),
    likeCount: 20,
    isLiked: false,
    isAuthor: false,
    isLoggedIn: false,
  },
};

export const ManyTags: Story = {
  args: {
    id: '1',
    title: 'タグが多い記事',
    tags: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind',
      'Prisma',
      'PostgreSQL',
    ],
    authorName: 'テストユーザー',
    createdAt: new Date('2026-01-01'),
    likeCount: 15,
    isLiked: false,
    isAuthor: false,
    isLoggedIn: false,
  },
};

export const LongTitle: Story = {
  args: {
    id: '1',
    title:
      'これはとても長いタイトルの記事です。Next.jsとReactとTypeScriptを使って開発する方法について詳しく解説します。',
    tags: ['Next.js', 'React'],
    authorName: 'テストユーザー',
    createdAt: new Date('2026-01-01'),
    likeCount: 8,
    isLiked: false,
    isAuthor: false,
    isLoggedIn: false,
  },
};

export const FullWidth: Story = {
  args: {
    id: '1',
    title: 'フル幅の記事カード',
    tags: ['Next.js', 'React'],
    authorName: 'テストユーザー',
    createdAt: new Date('2026-01-01'),
    likeCount: 12,
    isLiked: false,
    isAuthor: false,
    isLoggedIn: false,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};
