import type { Meta, StoryObj } from '@storybook/nextjs';
import { StockButton } from './StockButton';

const meta: Meta<typeof StockButton> = {
  title: 'Features/Articles/StockButton',
  component: StockButton,
};

export default meta;
type Story = StoryObj<typeof StockButton>;

export const Default: Story = {
  args: {
    articleId: '1',
    initialStocked: false,
  },
};

export const Stocked: Story = {
  args: {
    articleId: '1',
    initialStocked: true,
  },
};
