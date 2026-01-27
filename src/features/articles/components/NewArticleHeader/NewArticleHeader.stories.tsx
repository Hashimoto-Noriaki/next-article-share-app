import type { Meta, StoryObj } from '@storybook/nextjs';
import { NewArticleHeader } from './NewArticleHeader';

const meta: Meta<typeof NewArticleHeader> = {
  title: 'Features/Articles/NewArticleHeader',
  component: NewArticleHeader,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onPublish: { action: 'publish clicked' },
    onSaveDraft: { action: 'save draft clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof NewArticleHeader>;

export const Default: Story = {
  args: {
    isSubmitting: false,
    isDraftSubmitting: false,
  },
};

export const Publishing: Story = {
  args: {
    isSubmitting: true,
    isDraftSubmitting: false,
  },
};

export const SavingDraft: Story = {
  args: {
    isSubmitting: false,
    isDraftSubmitting: true,
  },
};
