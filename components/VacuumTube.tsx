import React from 'react';
import { Electron, ElectricFieldLine } from '../types';
import { TUBE_WIDTH, TUBE_HEIGHT, CATHODE_X, GRID_X, ANODE_X, VOLTAGE_AMPLITUDE, GRID_BIAS_VOLTAGE } from '../constants';

interface VacuumTubeProps {
  electrons: Electron[];
  gridVoltage: number;
  electricFieldLines: ElectricFieldLine[];
}

export const VacuumTube: React.FC<VacuumTubeProps> = ({ electrons, gridVoltage, electricFieldLines }) => {
  const gridColor = gridVoltage > 0 ? 'stroke-blue-400' : 'stroke-red-400';
  const gridFill = gridVoltage > 0 ? 'fill-blue-500/20' : 'fill-red-500/20';
  const fieldLineColor = gridVoltage > 0 ? 'stroke-blue-500' : 'stroke-red-500';
  const voltageIndicatorColor = gridVoltage > 0 ? 'bg-blue-400' : 'bg-red-400';
  
  // Normalize voltage around the bias to get a -1 to 1 range for the AC component
  const normalizedAcVoltage = (gridVoltage - GRID_BIAS_VOLTAGE) / VOLTAGE_AMPLITUDE;
  // Convert -1 to 1 range into 0% to 100% width
  const voltageIndicatorWidth = `${(normalizedAcVoltage + 1) * 50}%`;

  return (
    <div className="relative w-full aspect-[2/1] bg-black rounded-lg overflow-hidden">
      <svg viewBox={`0 0 ${TUBE_WIDTH} ${TUBE_HEIGHT}`} className="w-full h-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Electric Field Lines */}
        {electricFieldLines.map(line => (
          <g key={`field-${line.id}`}>
            <path
              d={`M ${GRID_X} ${line.y1} L ${line.isToAnode ? ANODE_X : CATHODE_X} ${line.y2}`}
              className={`${fieldLineColor} opacity-20`}
              strokeWidth="1"
              strokeDasharray="5 5"
            />
          </g>
        ))}

        {/* Cathode */}
        <g>
          <rect x={CATHODE_X - 10} y={TUBE_HEIGHT * 0.1} width="10" height={TUBE_HEIGHT * 0.8} className="fill-gray-600" />
          <text x={CATHODE_X - 5} y={TUBE_HEIGHT - 10} textAnchor="middle" className="fill-gray-400 text-xs font-mono">Cathode</text>
        </g>
        
        {/* Anode */}
        <g>
          <rect x={ANODE_X} y={TUBE_HEIGHT * 0.1} width="10" height={TUBE_HEIGHT * 0.8} className="fill-gray-500" />
          <text x={ANODE_X + 5} y={TUBE_HEIGHT - 10} textAnchor="middle" className="fill-gray-400 text-xs font-mono">Anode</text>
        </g>

        {/* Control Grid */}
        <g>
          <line
            x1={GRID_X}
            y1={TUBE_HEIGHT * 0.1}
            x2={GRID_X}
            y2={TUBE_HEIGHT * 0.9}
            className={`${gridColor} transition-all duration-100`}
            strokeWidth="4"
            strokeDasharray="10 10"
          />
          <text x={GRID_X} y={TUBE_HEIGHT - 10} textAnchor="middle" className="fill-gray-400 text-xs font-mono">Grid</text>
        </g>

        {/* Electrons */}
        {electrons.map(e => (
          <circle
            key={e.id}
            cx={e.x}
            cy={e.y}
            r="4"
            className="fill-yellow-300"
            filter="url(#glow)"
          />
        ))}
      </svg>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-700/50 rounded-full overflow-hidden border border-gray-600">
        <div className="h-full flex items-center justify-center text-xs font-bold text-black relative">
           <div 
             className={`${voltageIndicatorColor} h-full absolute left-0 transition-all duration-100 ease-linear`} 
             style={{ width: voltageIndicatorWidth }}>
           </div>
           <span className="relative z-10 mix-blend-difference text-white">Grid Voltage (AC)</span>
        </div>
      </div>
    </div>
  );
};
