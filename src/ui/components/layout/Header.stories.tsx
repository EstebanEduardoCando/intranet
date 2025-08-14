import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

/**
 * Header component for the main layout.
 * Displays the app bar with menu button and theme toggle.
 */
const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onMenuClick: { action: 'menu-clicked' },
    drawerWidth: {
      control: { type: 'number', min: 200, max: 400, step: 20 }
    }
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default header with standard drawer width
 */
export const Default: Story = {
  args: {
    drawerWidth: 240,
  },
};

/**
 * Header with narrow drawer
 */
export const NarrowDrawer: Story = {
  args: {
    drawerWidth: 200,
  },
};

/**
 * Header with wide drawer
 */
export const WideDrawer: Story = {
  args: {
    drawerWidth: 320,
  },
};