import * as React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Stack,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import theme from './theme';

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline';

const variants: Variant[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'overline',
  'button',
];

function useViewportWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

function useComputedPx(elRef: React.RefObject<HTMLElement | null>) {
  const [px, setPx] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const style = getComputedStyle(el);
      const v = parseFloat(style.fontSize);
      setPx(Number.isFinite(v) ? Math.round(v * 10) / 10 : null);
    });
    ro.observe(el);
    // Initial read
    const style = getComputedStyle(el);
    const v = parseFloat(style.fontSize);
    setPx(Number.isFinite(v) ? Math.round(v * 10) / 10 : null);
    return () => ro.disconnect();
  }, [elRef]);

  return px;
}

function VariantRow({ variant }: { variant: Variant }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const px = useComputedPx(ref);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      spacing={2}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: { xs: 'auto', md: 120 } }}>
          <Typography variant="subtitle2" color="text.secondary">
            {variant.toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ width: { xs: 'auto', md: 70 } }}>
          <Chip
            size="small"
            label={px ? `${px}px` : '—'}
            slotProps={{ label: { sx: { typography: 'caption' } } }}
          />
        </Box>
      </Stack>
      <Typography variant={variant} component="span" ref={ref} sx={{ flex: 1 }}>
        The quick brown fox jumps over the lazy dog.
      </Typography>
    </Stack>
  );
}

export default function App() {
  const vw = useViewportWidth();
  const bp = theme.breakpoints.values;
  const currentBp =
    vw >= bp.xl ? 'xl' : vw >= bp.lg ? 'lg' : vw >= bp.md ? 'md' : vw >= bp.sm ? 'sm' : 'xs';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Typography Hierarchy
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Current breakpoint: <strong>{currentBp}</strong> ({vw}px)
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={3}>
          {/* Header Row - Desktop only */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ pb: 1, display: { xs: 'none', md: 'flex' } }}
          >
            <Box sx={{ width: 120 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                VARIANT
              </Typography>
            </Box>
            <Box sx={{ width: 70 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                SIZE
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                PREVIEW
              </Typography>
            </Box>
          </Stack>

          {variants.map((v) => (
            <VariantRow key={v} variant={v} />
          ))}
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="overline" gutterBottom>
          About
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This typography hierarchy uses a macOS-style system font stack with responsive scaling
          via MUI's responsiveFontSizes() function. Resize your viewport to see font sizes adjust
          across breakpoints (sm, md, lg, xl).
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
