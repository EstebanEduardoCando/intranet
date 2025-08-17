import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Sidebar navigation component with responsive drawer functionality.
 * Contains main navigation links and can be toggled on mobile devices.
 */
const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Story />
          <div className="flex-1 p-4 bg-gray-50">
            <p>Main content area</p>
          </div>
        </div>
      </BrowserRouter>
    ),
  ],
  argTypes: {
    onDrawerToggle: { action: 'drawer-toggled' },
    mobileOpen: {
      control: { type: 'boolean' }
    },
    drawerWidth: {
      control: { type: 'number', min: 200, max: 400, step: 20 }
    }
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default sidebar (desktop view, closed on mobile)
 */
export const Default: Story = {
  args: {
    mobileOpen: false,
    onDrawerToggle: () => console.log('Drawer toggled'),
    drawerWidth: 240,
  },
};

/**
 * Mobile sidebar opened
 */
export const MobileOpen: Story = {
  args: {
    mobileOpen: true,
    onDrawerToggle: () => console.log('Drawer toggled'),
    drawerWidth: 240,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Narrow sidebar
 */
export const Narrow: Story = {
  args: {
    mobileOpen: false,
    onDrawerToggle: () => console.log('Drawer toggled'),
    drawerWidth: 200,
  },
};

/**
 * Wide sidebar
 */
export const Wide: Story = {
  args: {
    mobileOpen: false,
    onDrawerToggle: () => console.log('Drawer toggled'),
    drawerWidth: 320,
  },
};