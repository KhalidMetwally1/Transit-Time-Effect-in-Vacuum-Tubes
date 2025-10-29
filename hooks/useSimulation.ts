import { useState, useEffect, useRef, useCallback } from 'react';
import { FrequencyMode, Electron, PhaseDataPoint, ElectricFieldLine } from '../types';
import { TUBE_HEIGHT, TUBE_WIDTH, CATHODE_X, GRID_X, ANODE_X, ELECTRON_EMIT_INTERVAL, ELECTRON_INITIAL_VX, VOLTAGE_AMPLITUDE, ANODE_PULL, FREQUENCY_CONFIG, GRID_BIAS_VOLTAGE } from '../constants';

const MAX_PHASE_POINTS = 200;

export const useSimulation = (mode: FrequencyMode) => {
  const [electrons, setElectrons] = useState<Electron[]>([]);
  const [gridVoltage, setGridVoltage] = useState(0);
  const [anodeCurrent, setAnodeCurrent] = useState(0);
  const [phaseData, setPhaseData] = useState<PhaseDataPoint[]>([]);
  const [electricFieldLines, setElectricFieldLines] = useState<ElectricFieldLine[]>([]);

  const frameCountRef = useRef(0);
  const nextElectronIdRef = useRef(0);
  const animationFrameIdRef = useRef<number>(0);
  const lastAnodeHitTimeRef = useRef(0);
  const collectedElectronsRef = useRef(0);

  const resetSimulation = useCallback(() => {
    setElectrons([]);
    setPhaseData([]);
    frameCountRef.current = 0;
    nextElectronIdRef.current = 0;
    collectedElectronsRef.current = 0;
  }, []);

  useEffect(() => {
    resetSimulation();
  }, [mode, resetSimulation]);

  useEffect(() => {
    const run = () => {
      const time = frameCountRef.current;
      const config = FREQUENCY_CONFIG[mode];

      // 1. Update Grid Voltage (Vrf(t) + V0)
      const newGridVoltageAC = VOLTAGE_AMPLITUDE * Math.sin(2 * Math.PI * config.frequency * time);
      const newGridVoltage = GRID_BIAS_VOLTAGE + newGridVoltageAC;
      setGridVoltage(newGridVoltage);

      // 2. Emit New Electrons
      let newElectrons: Electron[] = [];
      if (time % ELECTRON_EMIT_INTERVAL === 0) {
        newElectrons.push({
          id: nextElectronIdRef.current++,
          x: CATHODE_X,
          y: TUBE_HEIGHT / 2 + (Math.random() - 0.5) * (TUBE_HEIGHT * 0.6),
          vx: ELECTRON_INITIAL_VX,
        });
      }
      
      // Reset current calculation
      collectedElectronsRef.current = 0;

      // 3. Update Electron Positions
      setElectrons(prevElectrons => {
        const updatedElectrons = [...prevElectrons, ...newElectrons].map(e => {
          // Simplified acceleration model
          // Force from grid is proportional to voltage and inverse square of distance
          const distToGrid = Math.abs(GRID_X - e.x);
          const gridForce = (newGridVoltage * 50) / (distToGrid * distToGrid + 100);
          
          let acceleration = gridForce + ANODE_PULL;

          // Ideal frequency "bunching" effect
          if (mode === FrequencyMode.Ideal && e.x > GRID_X) {
              acceleration *= 1.5;
          }
          
          const newVx = e.vx + acceleration;
          const newX = e.x + newVx;

          return { ...e, vx: newVx, x: newX };
        }).filter(e => {
          if (e.x >= ANODE_X) {
            collectedElectronsRef.current++;
            return false; // Electron collected by anode
          }
          if (e.x < CATHODE_X) {
            return false; // Electron repelled back to cathode
          }
          return e.x < TUBE_WIDTH;
        });
        return updatedElectrons;
      });

      // 4. Update Anode Current
      const newAnodeCurrent = collectedElectronsRef.current;
      setAnodeCurrent(newAnodeCurrent);
      if (time > 10) { // Let simulation stabilize a bit
        setPhaseData(prevData => {
            const newData = [...prevData, { time: time, gridVoltage: newGridVoltage, anodeCurrent: newAnodeCurrent * 10 }];
            return newData.length > MAX_PHASE_POINTS ? newData.slice(newData.length - MAX_PHASE_POINTS) : newData;
        });
      }

      // 5. Update Electric Field Visualization
      const lines: ElectricFieldLine[] = [];
      for (let i = 0; i < 15; i++) {
          lines.push({
              id: i,
              y1: TUBE_HEIGHT * 0.1 + i * (TUBE_HEIGHT * 0.8) / 14,
              y2: TUBE_HEIGHT * 0.1 + i * (TUBE_HEIGHT * 0.8) / 14,
              isToAnode: newGridVoltage > 0
          });
      }
      setElectricFieldLines(lines);

      frameCountRef.current++;
      animationFrameIdRef.current = requestAnimationFrame(run);
    };

    animationFrameIdRef.current = requestAnimationFrame(run);

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [mode]);

  return { electrons, gridVoltage, anodeCurrent, phaseData, electricFieldLines };
};
