import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/Atoms/Button',
  component: Button,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'ボタン（ログインなど）',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'ボタン（新規登録など）',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'ボタン（削除など）',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'ボタン（処理中など）',
    disabled: true,
  },
};
