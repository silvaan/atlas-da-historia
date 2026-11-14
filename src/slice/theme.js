// Two styles to choose from. The canvas reads its colors from here; the CSS gets the same colors as variables.
export const THEMES = {
  paper: {
    label: 'Paper', bg: '#F3EEE3', panel: '#FBF8F1', ink: '#2A251E', muted: '#7B7263', line: '#D9D0BE',
    ocean: '#DCE7E8', land: '#EEE7D7', tints: ['#E8DFCA', '#E4DAC2', '#EBE2CE', '#E0D6BD'], border: 'rgba(72,60,44,.42)', coast: 'rgba(72,60,44,.5)',
    halo: 'rgba(251,248,241,.9)', accent: '#C0392B', cause: '#2F6DB5', effect: '#B8791A', rowA: '#EAE3D2', rowB: '#E4DCC8', grid: 'rgba(72,60,44,.14)',
    mapAlpha: 0.78, dim: 0.28, dot: '#2A251E', today: 'rgba(42,37,30,.55)'
  },
  night: {
    label: 'Night', bg: '#11151B', panel: '#191F27', ink: '#ECE7DC', muted: '#8E96A3', line: '#2B333F',
    ocean: '#0E1823', land: '#262C35', tints: ['#2B323C', '#2F3640', '#293039', '#323944'], border: 'rgba(236,231,220,.3)', coast: 'rgba(236,231,220,.38)',
    halo: 'rgba(17,21,27,.88)', accent: '#FF7A5C', cause: '#6FA8FF', effect: '#F2B544', rowA: '#1D232B', rowB: '#222933', grid: 'rgba(236,231,220,.1)',
    mapAlpha: 0.72, dim: 0.25, dot: '#ECE7DC', today: 'rgba(236,231,220,.6)'
  }
};
export const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};
/* dark or light ink depending on the background color */
export const inkOn = hex => {
  const n = parseInt(hex.slice(1), 16), l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.58 ? '#1F1B16' : '#FFFFFF';
};
export function applyTheme(t) {
  const s = document.documentElement.style;
  for (const k of ['bg', 'panel', 'ink', 'muted', 'line', 'accent', 'cause', 'effect']) s.setProperty('--' + k, t[k]);
}
