import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArticleDeleteButton } from './ArticleDeleteButton';

const meta: Meta<typeof ArticleDeleteButton> = {
  title: 'Features/Articles/ArticleDeleteButton',
  component: ArticleDeleteButton,
};

export default meta;
type Story = StoryObj<typeof ArticleDeleteButton>;

export const Default: Story = {
  args: {
    articleId: '1',
  },
};
