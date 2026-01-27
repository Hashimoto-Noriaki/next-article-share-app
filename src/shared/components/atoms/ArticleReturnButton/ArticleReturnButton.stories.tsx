import type { meta,StoryObj } from '/@storybook/nextjs';
import { ArticleReturnButton } from './ArticleReturnButton';

const meta: Meta<typeof ArticleReturnButton> = {
  title: 'Shared/Atoms/ArticleReturnButton',
  component: ArticleReturnButton,
  decorators: [
    (Story) => (
      <div className="w-[500%]">
        <Story />
      </div>
    ),
  ],
};


export default meta;
type Story = StoryObj<typeof ArticleReturnButton>;

export const Default: Story = {
    args: {
    children: '戻る(記事一覧など)',
  },
} 
