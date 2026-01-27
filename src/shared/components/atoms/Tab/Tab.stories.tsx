import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tab } from './Tab';

const meta: Meta<typeof Tab> = {
  title: 'Shared/Atoms/Tab',
  component: Tab,
  argsTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Active: Story = {
  args: {
    label: '本文',
    isActive: true,
  },
};

export const Inactive: Story = {
  args: {
    label: 'プレビュー',
    isActive: true,
  },
};

export const TwoPane: Story = {
  args: {
    label: '2ペイン',
    isActive: false,
  },
};
