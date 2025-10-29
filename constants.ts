import { FrequencyMode } from './types';

// Simulation Dimensions (SVG coordinates)
export const TUBE_WIDTH = 800;
export const TUBE_HEIGHT = 400;
export const CATHODE_X = 50;
export const GRID_X = 350;
export const ANODE_X = 750;

// Simulation Physics
export const ELECTRON_EMIT_INTERVAL = 5; // Emit electron every N frames
export const ELECTRON_INITIAL_VX = 1.0;
export const VOLTAGE_AMPLITUDE = 10; // This is Vrf amplitude
export const GRID_BIAS_VOLTAGE = -2; // This is V0
export const ANODE_PULL = 0.05; // Constant positive pull from the anode

// Configuration for each frequency mode
export const FREQUENCY_CONFIG: Record<FrequencyMode, { title: string; description: string; frequency: number; }> = {
  [FrequencyMode.Low]: {
    title: 'Low Frequency',
    description: 'Electrons reach the anode before the grid voltage changes significantly. Anode current is in phase with grid voltage.',
    frequency: 0.005,
  },
  [FrequencyMode.Ideal]: {
    title: 'Ideal Frequency',
    description: 'Transit time matches the signal period, leading to electron bunching and maximum power transfer.',
    frequency: 0.02,
  },
  [FrequencyMode.High]: {
    title: 'High Frequency',
    description: 'Grid voltage reverses while electrons are in transit, causing deceleration and phase lag. Gain is reduced.',
    frequency: 0.05,
  },
};
