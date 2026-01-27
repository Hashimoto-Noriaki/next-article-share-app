import type { Meta, StoryObj } from '@storybook/nextjs';
import { WelcomeHeader } from './WelcomeHeader';

const meta: Meta<typeof WelcomeHeader> = {
  title: 'Features/Home/WelcomeHeader',
  component: WelcomeHeader,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof WelcomeHeader>;

export const Default: Story = {};
