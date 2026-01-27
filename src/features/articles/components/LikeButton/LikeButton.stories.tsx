import type { Meta, StoryObj } from '@storybook/nextjs';
import { LikeButton } from './LikeButton';

const meta: Meta<typeof LikeButton> = {
  title: 'features/Articles/LikeButton',
  component: LikeButton,
};

export default meta;
type Story = StoryObj<typeof LikeButton>;

export const Default: Story = {
  args: {
    articleId: '1',
    initialLiked: false,
    initialCount: 0,
    isAuthor: false,
  },
};

export const Liked: Story = {
  args: {
    articleId: '1',
    initialLiked: true,
    initialCount: 1,
    isAuthor: false,
  },
};

export const AsAuthor: Story = {
  args: {
    articleId: '2',
    initialLiked: false,
    initialCount: 10,
    isAuthor: true,
  },
};

