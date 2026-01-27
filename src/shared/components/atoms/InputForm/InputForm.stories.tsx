import type { Meta, StoryObj } from '@storybook/nextjs';
import { InputForm } from './InputForm';

const meta: Meta<typeof InputForm> = {
  title: 'Shared/Atoms/InputForm',
  component: InputForm,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InputForm>;

export const Default: Story = {
  args: {
    placeholder: 'テキストを入力',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'メールアドレス',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'パスワード',
  },
};
