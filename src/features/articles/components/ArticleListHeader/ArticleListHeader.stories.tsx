import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArticleListHeader } from './ArticleListHeader';

const meta: Meta<typeof ArticleListHeader> = {
  title: 'Features/Articles/ArticleListHeader',
  component: ArticleListHeader,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ArticleListHeader>;

export const Default: Story = {
  args: {
    userId: '1',
    userName: 'テストユーザー',
  },
};
