import type { Meta, StoryObj } from '@storybook/nextjs';
import { SearchableArticleList } from './SearchableArticleList';

const meta: Meta<typeof SearchableArticleList> = {
  title: 'Features/Articles/SearchableArticleList',
  component: SearchableArticleList,
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
type Story = StoryObj<typeof SearchableArticleList>;

const sampleArticles = [
  {
    id: '1',
    title: 'Next.js App Routerの使い方',
    tags: ['Next.js', 'React', 'TypeScript'],
    authorId: '2',
    likeCount: 10,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    author: { name: 'ユーザーA' },
    isLiked: false,
  },
  {
    id: '2',
    title: 'TypeScriptの型定義入門',
    tags: ['TypeScript', 'JavaScript'],
    authorId: '3',
    likeCount: 25,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
    author: { name: 'ユーザーB' },
    isLiked: true,
  },
  {
    id: '3',
    title: 'Tailwind CSSでモダンなUIを作る',
    tags: ['Tailwind', 'CSS', 'デザイン'],
    authorId: '1',
    likeCount: 15,
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z',
    author: { name: '自分' },
    isLiked: false,
  },
];

export const Default: Story = {
  args: {
    initialArticles: sampleArticles,
    userId: '1',
  },
};

export const Empty: Story = {
  args: {
    initialArticles: [],
    userId: '1',
  },
};

export const NotLoggedIn: Story = {
  args: {
    initialArticles: sampleArticles,
    userId: '',
  },
};
