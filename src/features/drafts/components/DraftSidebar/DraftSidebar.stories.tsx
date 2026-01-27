import type { Meta, StoryObj } from '@storybook/nextjs';
import { DraftSidebar } from './DraftSidebar';

const meta: Meta<typeof DraftSidebar> = {
  title: 'Features/Drafts/DraftSidebar',
  component: DraftSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DraftSidebar>;

const sampleDrafts = [
  {
    id: '1',
    title: 'Next.js App Routerの使い方',
    content:
      'この記事ではNext.js App Routerについて解説します。Server Componentsやレイアウト機能など、新しい機能を詳しく説明します。',
    tags: ['Next.js', 'React'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'TypeScriptの型定義入門',
    content: 'TypeScriptの基本的な型定義について学びましょう。',
    tags: ['TypeScript'],
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1日前
  },
  {
    id: '3',
    title: '',
    content: null,
    tags: [],
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3日前
  },
];

export const Default: Story = {
  args: {
    drafts: sampleDrafts,
  },
};

export const WithSelected: Story = {
  args: {
    drafts: sampleDrafts,
    selectedId: '1',
  },
};

export const Empty: Story = {
  args: {
    drafts: [],
  },
};

export const SingleDraft: Story = {
  args: {
    drafts: [sampleDrafts[0]],
  },
};
