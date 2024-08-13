import { extendTheme } from '@chakra-ui/react';
import { DM_Sans, Space_Mono } from 'next/font/google';

const fontHeading = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-body',
});

const theme = extendTheme({
  fonts: {
    heading: `var(--font-heading), sans-serif`,
    body: `var(--font-body), sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: '#ece3d4',
        fontFamily: `var(--font-body), sans-serif`,
        color: '#735E3F',
      },
      h1: {
        fontFamily: `var(--font-heading), sans-serif`,
        color: '#372A15',
      },
      h2: {
        fontFamily: `var(--font-heading), sans-serif`,
        color: '#372A15',
      },
      h3: {
        fontFamily: `var(--font-heading), sans-serif`,
        color: '#372A15',
      },
      h4: {
        fontFamily: `var(--font-heading), sans-serif`,
        color: '#372A15',
      },
      h5: {
        fontFamily: `var(--font-heading), sans-serif`,
        color: '#372A15',
      },
      h6: {
        fontFamily: `var(--font-heading), sans-serif`,
        color: '#372A15',
      },
    },
  },
});

export default theme;
