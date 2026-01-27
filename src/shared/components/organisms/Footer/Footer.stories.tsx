import type { Meta, StoryObj } from '@storybook/nextjs';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Shared/Organisms/Footer',
  component: Footer,
  decorators: [
    (Story) => (
      <div className="min-h-screen flex flex-col justify-end">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
