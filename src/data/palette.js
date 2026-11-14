// Map palette: daytime colours, vivid enough for the globe against the dark background of space
import { T } from './grid.js';

export const TERRAIN_COLORS = {
  [T.DEEP]: '#1D5B82', [T.SHALLOW]: '#3E93B0', [T.PLAIN]: '#A9C774', [T.FOREST]: '#5E9A55',
  [T.DESERT]: '#EACB8C', [T.HILL]: '#A7AE72', [T.MOUNT]: '#A9967C', [T.TUNDRA]: '#BCC4AE',
  [T.ICE]: '#F1F5F7', [T.JUNGLE]: '#3D8A52', [T.STEPPE]: '#D6C37F', [T.FLOOD]: '#86C463'
};
export const EMPIRE_COLORS = ['#D8453B', '#E8992E', '#22A39A', '#8C62D0', '#3F7FE0', '#D45A8C', '#6FA238', '#A87A4E'];
export const ROOF_COLORS = { r: '#B9573C', c: '#3F4B5C', p: '#C7A36A', a: '#9A7A52', x: '#9C6B4A' };
export const MISC = {
  river: '#4E8FB0', road: '#8C6A3E', lane: '#F4F1E8', wall: '#EFE7D4', temple: '#F6F2E8',
  snow: '#F7F7F2', trunk: '#6B4F35', pine: '#4C7A4E', leaf: '#5F9358', palm: '#3F7D4C',
  skin: '#C99A74', ox: '#6E4C30', cart: '#8E6538', wheel: '#3A2B1D', camel: '#C49A5C',
  hull: '#5C3B22', sail: '#F3EEE0', sky: '#020308', ground: '#6E7F5A'
};
export const TUNICS = ['#9C4A3A', '#3E6A8C', '#7A6A3A', '#5B7B4A', '#8A5A8A', '#C9A15A', '#E9E2D0', '#A86F3F'];
