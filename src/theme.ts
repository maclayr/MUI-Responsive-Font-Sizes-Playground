import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  typography: {
    // macOS-style system stack + MUI's recommendation
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'system-ui',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),

    // Headings
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',       // ~40px
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',         // ~32px
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',      // ~28px
      lineHeight: 1.25,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',       // ~24px
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',      // ~20px
      lineHeight: 1.35,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',     // ~18px
      lineHeight: 1.4,
    },

    // Body & subtitles
    body1: {
      fontSize: '1rem',         // ~16px
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',     // ~14px
      lineHeight: 1.5,
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.4,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
      fontWeight: 500,
    },

    // UI text
    button: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
      fontWeight: 600,
      textTransform: 'none',    // more "enterprise" than ALL CAPS
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.02em',
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.75rem',
      lineHeight: 1.6,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600,
    },
  },
});

// Let MUI generate breakpoint-specific sizes for headings/subtitles
theme = responsiveFontSizes(theme, {
  // tweak if you want more/less scaling intensity
  factor: 6,
  variants: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
  ],
});

export default theme;
