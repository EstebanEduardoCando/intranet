import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import { Typography } from '@mui/material';

/**
 * Main layout component that combines Header, Sidebar, Footer, and Body.
 * Provides the overall structure for the application pages.
 */
const meta = {
  title: 'Layout/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete layout with sample content
 */
export const Default: Story = {
  render: () => <Layout />,
};

/**
 * Layout on mobile viewport
 */
export const Mobile: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Layout on tablet viewport
 */
export const Tablet: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};