import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { ErrorFallback } from './ErrorFallback';

const meta: Meta<typeof ErrorFallback> = {
  title: 'Shared/Organisms/ErrorFallback',
  component: ErrorFallback,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    error: new Error('想定外のエラー'),
    reset: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ErrorFallback>;

export const Default: Story = {};

export const WithDigest: Story = {
  args: {
    error: Object.assign(new Error('想定外のエラー'), { digest: '1234567890' }),
  },
};
