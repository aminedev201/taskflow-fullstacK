import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useTranslation } from 'react-i18next';
import ColorModeContext from './ColorModeContext';
import { ToastProvider } from '../components/Toast';

const cacheLtr = createCache({ key: 'muiltr' });
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

function initialMode() {
  const saved = localStorage.getItem('mode');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function AppProviders({ children }) {
  const { i18n } = useTranslation();
  const rtl = i18n.language === 'ar';
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [rtl, i18n.language]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggle: () =>
        setMode((m) => {
          const next = m === 'light' ? 'dark' : 'light';
          localStorage.setItem('mode', next);
          return next;
        }),
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        direction: rtl ? 'rtl' : 'ltr',
        palette: {
          mode,
          primary: mode === 'light' ? { main: '#EF6C00', light: '#FF9800', dark: '#E65100', contrastText: '#fff' }
                                    : { main: '#FF9800', light: '#FFB74D', dark: '#F57C00', contrastText: '#1a1208' },
          secondary: { main: '#8D6E63' },
          background: mode === 'light' ? { default: '#FAF6F2', paper: '#FFFFFF' } : { default: '#14110F', paper: '#1E1A17' },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: rtl ? '"Cairo","Roboto",sans-serif' : '"Roboto","Cairo",sans-serif',
          button: { textTransform: 'none', fontWeight: 600 },
        },
        components: {
          MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
          MuiButton: { defaultProps: { disableElevation: true } },
        },
      }),
    [mode, rtl]
  );

  return (
    <CacheProvider value={rtl ? cacheRtl : cacheLtr}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}
