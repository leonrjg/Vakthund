import { extendTheme } from '@mui/joy/styles';

export const theme = extendTheme({
  fontFamily: {
    display: '"Inconsolata", serif',  // Headers only
    // body uses default MUI font
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: '#f7f7f7',  // Bootstrap bg-body equivalent
        },
        neutral: {
          50: '#f8f9fa',    // Bootstrap bg-light equivalent
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',   // Bootstrap bg-dark equivalent
          900: '#0d0f11',
        }
      }
    }
  }
});
