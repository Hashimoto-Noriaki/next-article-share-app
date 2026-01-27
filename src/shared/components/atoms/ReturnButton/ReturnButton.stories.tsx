import type { Meta, StoryObj } from '@storybook/nextjs'
import { ReturnButton } from './ReturnButton';

const meta: Meta<typeof ReturnButton> = {
    title:'Shared/Atoms/ReturnButton',
    component: ReturnButton,
    decorators: [
        (Story) =>(
            <div className="w-[500px]">
                <Story/>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ReturnButton>

export const  Default: Story = {
    args:{
        children: '戻る(記事一覧など)',
    }
}
