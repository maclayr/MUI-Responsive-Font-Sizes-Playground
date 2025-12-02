// App.tsx
import * as React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Stack,
  Typography,
  Box,
  Divider,
  FormControlLabel,
  Checkbox,
  Slider,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Your assumptions
const fontFamily =
  '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const modularRatio = 1.2;

// Build the base theme (before responsiveFontSizes)
// Accept a fontFamily and htmlFontSize so themes can be rebuilt when the user switches fonts or base size
function buildBaseTheme(selectedFont: string = fontFamily, baseFontSize: number = 12) {
  return createTheme({
    cssVariables: true, // easier to inspect generated CSS
    breakpoints: {
      values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
    },
    typography: {
      htmlFontSize: baseFontSize,
      fontFamily: selectedFont,
      // Body
      body1: { fontSize: '.75rem', lineHeight: 1.6 },
      body2: { fontSize: `${0.875}rem`, lineHeight: 1.6 }, // ~12.25px
      // Headings via 1.20 modular scale
      h6: { fontSize: `${1 * modularRatio}rem`, fontWeight: 600, lineHeight: 1.3 },
      h5: { fontSize: `${Math.pow(modularRatio, 2)}rem`, fontWeight: 600, lineHeight: 1.25 },
      h4: { fontSize: `${Math.pow(modularRatio, 3)}rem`, fontWeight: 600, lineHeight: 1.2 },
      h3: { fontSize: `${Math.pow(modularRatio, 4)}rem`, fontWeight: 700, lineHeight: 1.15 },
      h2: { fontSize: `${Math.pow(modularRatio, 5)}rem`, fontWeight: 700, lineHeight: 1.1 },
      h1: { fontSize: `${Math.pow(modularRatio, 6)}rem`, fontWeight: 700, lineHeight: 1.05 },
      // Labels
      button: { fontSize: '1rem', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'none', lineHeight: 1.2 },
      caption: { fontSize: `${0.75}rem`, lineHeight: 1.4, letterSpacing: '0.01em' },
      overline: { fontSize: `${0.75}rem`, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.4 },
    },
  });
}

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
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
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ width: 140 }}>
        <Typography variant="overline" color="text.secondary">
          {variant.toUpperCase()}
        </Typography>
      </Box>
      <Typography variant={variant} component="span" ref={ref}>
        The quick brown fox jumps over the lazy dog.
      </Typography>
      <Chip size="small" label={px ? `${px}px` : '—'} sx={{ ml: 'auto' }} slotProps={{ label: { sx: { typography: 'body1' } } }} />
    </Stack>
  );
}

export default function App() {
  // font options available to the user
  const fonts: Record<string, string> = {
    'IBM Plex Sans':
      '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    Inter: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    Poppins: '"Poppins", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    Roboto: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    System: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const [selectedFont, setSelectedFont] = React.useState<string>('IBM Plex Sans');

  // Keep a CSS variable in sync so non-MUI global styles also update
  React.useEffect(() => {
    document.documentElement.style.setProperty('--app-font', fonts[selectedFont]);
  }, [selectedFont]);

  const [factor, setFactor] = React.useState(8);
  const [disableAlign, setDisableAlign] = React.useState(false);
  const [includeXl, setIncludeXl] = React.useState(true);
  const [baseFontSize, setBaseFontSize] = React.useState(12);
  const vw = useViewportWidth();

  // Build theme reactively and rebuild when the selected font changes
  const theme = React.useMemo(() => {
    let base = buildBaseTheme(fonts[selectedFont], baseFontSize);
    base = responsiveFontSizes(base, {
      breakpoints: includeXl ? ['sm', 'md', 'lg', 'xl'] : ['sm', 'md', 'lg'],
      factor,
      disableAlign,
      variants, // scale all listed variants
    });
    return base;
  }, [factor, disableAlign, includeXl, selectedFont, baseFontSize]);

  const bp = theme.breakpoints.values;
  const currentBp =
    vw >= bp.xl ? 'xl' : vw >= bp.lg ? 'lg' : vw >= bp.md ? 'md' : vw >= bp.sm ? 'sm' : 'xs';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          MUI Responsive Font Sizes Playground
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Base html FontSize: {baseFontSize}px • Modular ratio: {modularRatio} • Current breakpoint: {currentBp} ({vw}px)
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center" sx={{ my: 2 }}>
          <Box sx={{ width: 260 }}>
            <Typography variant="caption" color="text.secondary">
              factor ({factor.toFixed(1)})
            </Typography>
            <Slider
              min={1}
              max={10}
              step={1}
              value={factor}
              onChange={(_, v) => setFactor(v as number)}
              aria-label="factor"
            />
          </Box>
          <Box sx={{ width: 220 }}>
            <FormControl fullWidth>
              <InputLabel id="font-select-label">Font</InputLabel>
              <Select
                labelId="font-select-label"
                value={selectedFont}
                label="Font"
                onChange={(e) => setSelectedFont(e.target.value as string)}
              >
                {Object.keys(fonts).map((k) => (
                  <MenuItem key={k} value={k}>
                    {k}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: 180 }}>
            <FormControl fullWidth>
              <InputLabel id="base-fontsize-label">Base Size</InputLabel>
              <Select
                labelId="base-fontsize-label"
                value={baseFontSize}
                label="Base Size"
                onChange={(e) => setBaseFontSize(e.target.value as number)}
              >
                <MenuItem value={12}>12px</MenuItem>
                <MenuItem value={14}>14px</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FormControlLabel
            control={<Checkbox checked={disableAlign} onChange={(e) => setDisableAlign(e.target.checked)} />}
            label="disableAlign"
          />
          <FormControlLabel
            control={<Checkbox checked={includeXl} onChange={(e) => setIncludeXl(e.target.checked)} />}
            label={
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                include xl breakpoint
                <Tooltip
                  title={
                    "When enabled, responsive font sizes will also adjust at the 'xl' breakpoint (≥1920px). When disabled, sizes above 'lg' stay unchanged."
                  }
                >
                  <Box
                    component="span"
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: 'text.secondary',
                      color: 'text.secondary',
                      fontSize: 12,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'default',
                    }}
                    aria-hidden
                  >
                    i
                  </Box>
                </Tooltip>
              </Box>
            }
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>
          {variants.map((v) => (
            <VariantRow key={v} variant={v} />
          ))}
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="overline">Notes</Typography>
        <Typography variant="body2" color="text.secondary">
          Lower factor increases small-screen sizes more aggressively. Keep line-heights unitless to allow alignment to
          the 4px grid when disableAlign is off. Resize the viewport to see font-size changes at sm, md, lg, and xl. 
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
