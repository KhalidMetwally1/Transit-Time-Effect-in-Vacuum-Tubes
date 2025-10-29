import React, { useState, useMemo } from 'react';
import { VacuumTube } from './components/VacuumTube';
import { Controls } from './components/Controls';
import { PhaseDiagram } from './components/PhaseDiagram';
import { useSimulation } from './hooks/useSimulation';
import { FrequencyMode } from './types';
import { FREQUENCY_CONFIG } from './constants';

const App: React.FC = () => {
  const [frequencyMode, setFrequencyMode] = useState<FrequencyMode>(FrequencyMode.Low);
  const simulationState = useSimulation(frequencyMode);

  const { title, description } = useMemo(() => FREQUENCY_CONFIG[frequencyMode], [frequencyMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-4">
        <header className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-cyan-300 tracking-wider">
            Transit-Time Effect in a Vacuum Tube
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            From Stable Amplification to Phase Delay and Power Loss.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 bg-black/50 rounded-xl shadow-2xl shadow-cyan-500/10 p-4 border border-gray-700">
            <div className="relative">
              <VacuumTube
                electrons={simulationState.electrons}
                gridVoltage={simulationState.gridVoltage}
                electricFieldLines={simulationState.electricFieldLines}
              />
              <div className="absolute top-2 left-2 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                <h2 className="text-lg font-bold text-yellow-300">{title}</h2>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-gray-800/60 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-3 text-cyan-200">Controls</h3>
              <Controls selectedMode={frequencyMode} onModeChange={setFrequencyMode} />
              <p className="mt-4 text-gray-400 text-sm">{description}</p>
            </div>

            <div className="bg-gray-800/60 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-3 text-cyan-200">Signal Waveforms</h3>
              <p className="text-xs text-gray-500 mb-2 -mt-2">(Voltage & Current vs. Time)</p>
              <div className="h-48">
                <PhaseDiagram data={simulationState.phaseData} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
