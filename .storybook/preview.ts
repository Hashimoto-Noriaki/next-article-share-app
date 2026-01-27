import type { Preview } from '@storybook/nextjs';
import '../src/app/globals.css'; 

const preview: Preview = {
  parameters: {
    layout: 'centered',//中央に配置
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
