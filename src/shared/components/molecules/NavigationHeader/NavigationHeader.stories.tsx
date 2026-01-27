import type { Meta, StoryObj } from '@storybook/nextjs';
import { NavigationHeader } from './NavigationHeader';

const meta: Meta<typeof NavigationHeader> = {
  title: 'Shared/Molecules/NavigationHeader',
  component: NavigationHeader,
  decorators: [
    (Story) => (
      <div className="bg-cyan-600 p-4 rounded">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavigationHeader>;

export const Default: Story = {
  args: {
    userId: '1',
    userName: 'テストユーザー',
  },
};