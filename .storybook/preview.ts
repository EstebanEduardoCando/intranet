import type { Preview } from '@storybook/react-vite'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import '../src/index.css'; // Import Tailwind styles

// Create MUI theme for Storybook
const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      extractComponentDescription: (component, { notes }) => {
        if (notes) {
          return typeof notes === 'string' ? notes : notes.markdown || notes.text;
        }
        return null;
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? darkTheme : lightTheme;
      
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="p-4">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light theme' },
          { value: 'dark', title: 'Dark theme' },
        ],
        showName: true,
      },
    },
  },
};

export default preview;