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
  render: () => (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        This is the main content area. The layout includes:
      </Typography>
      <ul>
        <li>Header with app bar and theme toggle</li>
        <li>Responsive sidebar with navigation</li>
        <li>Main content area (this section)</li>
        <li>Footer at the bottom</li>
      </ul>
    </Layout>
  ),
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