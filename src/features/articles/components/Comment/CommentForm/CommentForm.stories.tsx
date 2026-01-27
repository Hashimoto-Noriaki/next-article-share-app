import type { Meta, StoryObj } from '@storybook/nextjs';
import { CommentForm } from './CommentForm';

const meta: Meta<typeof CommentForm> = {
  title: 'Features/Articles/Comment/CommentForm',
  component: CommentForm,
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommentForm>;

export const Default: Story = {
  args: {
    articleId: '1',
  },
};
