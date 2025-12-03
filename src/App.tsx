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
  Link,
  IconButton,
  Collapse,
} from '@mui/material';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Extend MUI theme types to include custom 'label' variant
declare module '@mui/material/styles' {
  interface TypographyVariants {
    label: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
  }
}

// Update Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true;
  }
}

// Your assumptions
const fontFamily =
  '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// Build the base theme (before responsiveFontSizes)
// Accept a fontFamily, htmlFontSize, modularRatio, fontWeights, and letterSpacings so themes can be rebuilt when the user changes settings
function buildBaseTheme(
  selectedFont: string = fontFamily,
  baseFontSize: number = 10,
  modularRatio: number = 1.25,
  fontWeights: Record<string, number> = {},
  letterSpacings: Record<string, number> = {}
) {
  return createTheme({
    cssVariables: true, // easier to inspect generated CSS
    breakpoints: {
      values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '1rem',
            fontWeight: fontWeights.label ?? 500,
            letterSpacing: `${letterSpacings.label ?? 0.00938}em`,
            lineHeight: 1.4375,
          },
        },
      },
    },
    typography: {
      htmlFontSize: baseFontSize,
      fontFamily: selectedFont,
      // Body
      body1: { fontSize: '14px', lineHeight: 1.6, fontWeight: fontWeights.body1 ?? 400, letterSpacing: `${letterSpacings.body1 ?? 0}em` },
      body2: { fontSize: '12px', lineHeight: 1.6, fontWeight: fontWeights.body2 ?? 400, letterSpacing: `${letterSpacings.body2 ?? 0}em` },
      // Headings via modular scale
      subtitle1: { fontSize: `${Math.pow(modularRatio, 0)}rem`, fontWeight: fontWeights.subtitle1 ?? 500, lineHeight: 1.4, letterSpacing: `${letterSpacings.subtitle1 ?? 0.009}em`},
      subtitle2: { fontSize: `${Math.pow(modularRatio, 1)}rem`, fontWeight: fontWeights.subtitle2 ?? 500, lineHeight: 1.33, letterSpacing: `${letterSpacings.subtitle2 ?? 0.006}em` },
      h6: { fontSize: `${1 * modularRatio}rem`, fontWeight: fontWeights.h6 ?? 600, lineHeight: 1.3, letterSpacing: `${letterSpacings.h6 ?? 0.009}em` },
      h5: { fontSize: `${Math.pow(modularRatio, 2)}rem`, fontWeight: fontWeights.h5 ?? 700, lineHeight: 1.25, letterSpacing: `${letterSpacings.h5 ?? 0}em` },
      h4: { fontSize: `${Math.pow(modularRatio, 3)}rem`, fontWeight: fontWeights.h4 ?? 600, lineHeight: 1.2, letterSpacing: `${letterSpacings.h4 ?? 0.016}em` },
      h3: { fontSize: `${Math.pow(modularRatio, 4)}rem`, fontWeight: fontWeights.h3 ?? 700, lineHeight: 1.15, letterSpacing: `${letterSpacings.h3 ?? 0}em` },
      h2: { fontSize: `${Math.pow(modularRatio, 5)}rem`, fontWeight: fontWeights.h2 ?? 600, lineHeight: 1.1, letterSpacing: `${letterSpacings.h2 ?? -0.031}em` },
      h1: { fontSize: `${Math.pow(modularRatio, 6)}rem`, fontWeight: fontWeights.h1 ?? 600, lineHeight: 1.05, letterSpacing: `${letterSpacings.h1 ?? -0.094}em` },
      // Labels
      button: { fontSize: '1rem', fontWeight: fontWeights.button ?? 500, letterSpacing: `${letterSpacings.button ?? 0.02}em`, textTransform: 'none', lineHeight: 1.2 },
      caption: { fontSize: `${0.75}rem`, lineHeight: 1.4, letterSpacing: `${letterSpacings.caption ?? 0.01}em`, fontWeight: fontWeights.caption ?? 400 },
      overline: { fontSize: `${0.75}rem`, fontWeight: fontWeights.overline ?? 600, letterSpacing: `${letterSpacings.overline ?? 0.08}em`, textTransform: 'uppercase', lineHeight: 1.4 },
      label: { fontSize: '1rem', fontWeight: fontWeights.label ?? 500, letterSpacing: `${letterSpacings.label ?? 0.00938}em`, lineHeight: 1.4375 },
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
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline'
  | 'label';

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
  'label',
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

function VariantRow({
  variant,
  fontWeight,
  onFontWeightChange,
  letterSpacing,
  onLetterSpacingChange,
}: {
  variant: Variant;
  fontWeight: number;
  onFontWeightChange: (weight: number) => void;
  letterSpacing: number;
  onLetterSpacingChange: (spacing: number) => void;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const px = useComputedPx(ref);
  const [expanded, setExpanded] = React.useState(false);

  const fontWeightOptions = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  {/* Style Rows */}
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'stretch', md: 'center' }}
      spacing={2}
    >
      {/* Row 1: Variant + Chip + Toggle Button */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ width: { xs: 'auto', md: 100 } }}>
          <Typography variant="subtitle2" color="text.secondary">
            {variant.toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ width: { xs: 'auto', md: 60 } }}>
          <Chip size="small" label={px ? `${px}px` : '—'} slotProps={{ label: { sx: { typography: 'body1' } } }} />
        </Box>
      </Stack>

      {/* Row 2: Preview Text */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
        <Typography variant={variant} component="span" ref={ref} sx={{ flex: 1 }}>
          The quick brown fox jumps over the lazy dog.
        </Typography>
        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 'auto' }}
          aria-label={expanded ? 'collapse adjusters' : 'expand adjusters'}
        >
          <Typography variant="button" sx={{ mr: 0.5 }}>Adjust</Typography>
          <Typography variant="button" sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
            ▼
          </Typography>
        </IconButton>

      </Stack>

      {/* Row 3: Selectors - Always visible on md+, collapsible on xs-sm */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
        <FormControl size="small" sx={{ width: 90 }}>
          <Select
            value={fontWeight}
            onChange={(e) => onFontWeightChange(e.target.value as number)}
            variant="outlined"
          >
            {fontWeightOptions.map((weight) => (
              <MenuItem key={weight} value={weight}>
                {weight}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ width: 12 }} />
        <Box sx={{ flex: 1, minWidth: 180 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
            Letter Spacing: {letterSpacing.toFixed(3)}em
          </Typography>
          <Slider
            min={-0.2}
            max={0.2}
            step={0.001}
            value={letterSpacing}
            onChange={(_, v) => onLetterSpacingChange(v as number)}
            size="small"
            aria-label="letter spacing"
          />
        </Box>
      </Box>

      {/* Collapsible adjusters for mobile */}
      <Collapse in={expanded} sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
        <Stack spacing={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Font Weight</InputLabel>
            <Select
              value={fontWeight}
              onChange={(e) => onFontWeightChange(e.target.value as number)}
              variant="outlined"
              label="Font Weight"
            >
              {fontWeightOptions.map((weight) => (
                <MenuItem key={weight} value={weight}>
                  {weight}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
              Letter Spacing: {letterSpacing.toFixed(3)}em
            </Typography>
            <Slider
              min={-0.2}
              max={0.2}
              step={0.001}
              value={letterSpacing}
              onChange={(_, v) => onLetterSpacingChange(v as number)}
              size="small"
              aria-label="letter spacing"
            />
          </Box>
        </Stack>
      </Collapse>
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

  const [factor, setFactor] = React.useState(2.00);
  const [disableAlign, setDisableAlign] = React.useState(false);
  const [includeXl, setIncludeXl] = React.useState(true);
  const [baseFontSize, setBaseFontSize] = React.useState(12);
  const [modularRatio, setModularRatio] = React.useState(1.20);
  const vw = useViewportWidth();

  // Font weights for each variant (using default values)
  const [fontWeights, setFontWeights] = React.useState<Record<string, number>>({
    h1: 600,
    h2: 600,
    h3: 700,
    h4: 600,
    h5: 700,
    h6: 600,
    subtitle1: 500,
    subtitle2: 500,
    body1: 400,
    body2: 400,
    button: 500,
    caption: 400,
    overline: 600,
    label: 400,
  });

  const handleFontWeightChange = (variant: Variant, weight: number) => {
    setFontWeights((prev) => ({ ...prev, [variant]: weight }));
  };

  // Letter spacings for each variant (using default values)
  const [letterSpacings, setLetterSpacings] = React.useState<Record<string, number>>({
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
    subtitle1: 0,
    subtitle2: 0,
    body1: 0,
    body2: 0,
    button: 0,
    caption: 0,
    overline: 0,
    label: 0,
  });

  const handleLetterSpacingChange = (variant: Variant, spacing: number) => {
    setLetterSpacings((prev) => ({ ...prev, [variant]: spacing }));
  };

  // Set the actual base font size on the html element
  React.useEffect(() => {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }, [baseFontSize]);

  // Build theme reactively and rebuild when the selected font, font weights, or letter spacings change
  const theme = React.useMemo(() => {
    let base = buildBaseTheme(fonts[selectedFont], baseFontSize, modularRatio, fontWeights, letterSpacings);
    base = responsiveFontSizes(base, {
      breakpoints: includeXl ? ['sm', 'md', 'lg', 'xl'] : ['sm', 'md', 'lg'],
      factor,
      disableAlign,
      variants, // scale all listed variants
    });
    return base;
  }, [factor, disableAlign, includeXl, selectedFont, baseFontSize, modularRatio, fontWeights, letterSpacings]);

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

        <Stack direction="row" alignItems="center" sx={{ my: 2, flexWrap: 'wrap', justifyContent: 'flex-start', gap: 3 }}>
          <Box sx={{ flex: 1, minWidth: "150px" }}>
            <Typography variant="label" color="text.secondary">
              Factor ({factor.toFixed(1)})
            </Typography>
            <Slider
              min={1}
              max={8}
              step={.1}
              value={factor}
              onChange={(_, v) => setFactor(v as number)}
              aria-label="factor"
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: "150px" }}>
            <Typography variant="label" color="text.secondary">
              Modular Ratio ({modularRatio.toFixed(2)})
            </Typography>
            <Slider
              min={1.0}
              max={2.0}
              step={0.01}
              value={modularRatio}
              onChange={(_, v) => setModularRatio(v as number)}
              aria-label="modular ratio"
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: "150px" }}>
            <FormControl fullWidth>
              <InputLabel id="font-select-label" sx={{ typography: 'label'}}>Font</InputLabel>
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
          <Box sx={{ flex: 1, minWidth: "150px" }}>
            <FormControl fullWidth>
              <InputLabel id="base-fontsize-label" sx={{ typography: 'label'}}>Base Size</InputLabel>
              <Select
                labelId="base-fontsize-label"
                value={baseFontSize}
                label="Base Size"
                onChange={(e) => setBaseFontSize(e.target.value as number)}
              >
                <MenuItem value={8}>8px</MenuItem>
                <MenuItem value={10}>10px</MenuItem>
                <MenuItem value={12}>12px</MenuItem>
                <MenuItem value={14}>14px</MenuItem>
                <MenuItem value={16}>16px</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/*disableAlign checkbox*/}
          <FormControlLabel
            control={<Checkbox checked={disableAlign} onChange={(e) => setDisableAlign(e.target.checked)} />}
            label={
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.2, whiteSpace: 'nowrap' }}>
                disableAlign
                <Tooltip
                  title={
                    <>
                      disableAlign: Adjusts font sizes to keep text lines aligned to a 4px grid. Requires unitless line-height. Set to true to disable these adjustments.{' '}
                      <Link href="https://mui.com/material-ui/customization/theming/#responsivefontsizes-theme-options-theme" target="_blank" rel="noopener" color="inherit">
                        MUI documentation
                      </Link>
                      .
                    </>
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
                      flexShrink: 0,
                      ml: 0.5,
                    }}
                    aria-hidden
                  >
                    i
                  </Box>
                </Tooltip>
              </Box>
            }
          />
          {/*xl breakpoint checkbox*/}
          <FormControlLabel
            control={<Checkbox checked={includeXl} onChange={(e) => setIncludeXl(e.target.checked)} />}
            label={
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0, whiteSpace: 'nowrap' }}>
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
                      flexShrink: 0,
                      ml: 0.5,
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

        <Stack spacing={{xs: 4, md: 2}}>
          {/* Header Row */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ pb: 1, display: { xs: 'none', lg: 'flex' } }}>
            <Box sx={{ width: 100 }}>
              <Typography variant="h6" color="text.secondary" fontWeight={600}>
                VARIANT
              </Typography>
            </Box>
            <Box sx={{ width: 60 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                SIZE
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                PREVIEW
              </Typography>
            </Box>
            <Box sx={{ width: 90 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                FONT WEIGHT
              </Typography>
            </Box>
            <Box sx={{ width: 12 }} />
            <Box sx={{ width: 180 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                LETTER SPACING
              </Typography>
            </Box>
          </Stack>

          {variants.map((v) => (
            <VariantRow
              key={v}
              variant={v}
              fontWeight={fontWeights[v] || 400}
              onFontWeightChange={(weight) => handleFontWeightChange(v, weight)}
              letterSpacing={letterSpacings[v] || 0}
              onLetterSpacingChange={(spacing) => handleLetterSpacingChange(v, spacing)}
            />
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
