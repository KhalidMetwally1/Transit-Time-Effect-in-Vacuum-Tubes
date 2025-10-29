export enum FrequencyMode {
  Low = 'Low',
  Ideal = 'Ideal',
  High = 'High',
}

export interface Electron {
  id: number;
  x: number;
  y: number;
  vx: number;
}

export interface ElectricFieldLine {
    id: number;
    y1: number;
    y2: number;
    isToAnode: boolean;
}

export interface PhaseDataPoint {
  time: number;
  gridVoltage: number;
  anodeCurrent: number;
}
