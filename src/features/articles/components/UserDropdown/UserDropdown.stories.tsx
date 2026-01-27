import type { Meta, StoryObj } from '@storybook/nextjs';
import { UserDropdown } from './UserDropdown';

const meta: Meta<typeof UserDropdown> = {
  title: 'Features/Articles/UserDropdown',
  component: UserDropdown,
  decorators: [
    (Story) => (
      <div className="bg-cyan-600 p-4 rounded text-white font-bold">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserDropdown>;

export const Default: Story = {
  args: {
    userId: '1',
    userName: 'テストユーザー',
  },
};
