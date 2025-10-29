import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PhaseDataPoint } from '../types';
import { VOLTAGE_AMPLITUDE, GRID_BIAS_VOLTAGE } from '../constants';

interface WaveformChartProps {
  data: PhaseDataPoint[];
}

export const PhaseDiagram: React.FC<WaveformChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" opacity={0.5} />
        <XAxis
          dataKey="time"
          type="number"
          domain={['dataMin', 'dataMax']}
          tick={false}
          axisLine={false}
          label={{ value: "Time", position: "insideBottom", dy: 10, fill: '#A0AEC0', fontSize: 12 }}
        />
        <YAxis
          yAxisId="left"
          dataKey="gridVoltage"
          type="number"
          orientation="left"
          domain={[GRID_BIAS_VOLTAGE - VOLTAGE_AMPLITUDE - 2, GRID_BIAS_VOLTAGE + VOLTAGE_AMPLITUDE + 2]}
          stroke="#63B3ED"
          tick={{ fill: '#A0AEC0', fontSize: 10 }}
          axisLine={{ stroke: '#718096' }}
          tickLine={{ stroke: '#718096' }}
          width={40}
        />
        <YAxis
          yAxisId="right"
          dataKey="anodeCurrent"
          type="number"
          orientation="right"
          domain={[0, 'dataMax + 10']}
          stroke="#2DD4BF"
          tick={{ fill: '#A0AEC0', fontSize: 10 }}
          axisLine={{ stroke: '#718096' }}
          tickLine={{ stroke: '#718096' }}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            borderColor: '#4A5568',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#E2E8F0' }}
          itemStyle={{ fontWeight: 'bold' }}
          labelFormatter={(value) => `Time: ${value}`}
        />
        <Legend verticalAlign="top" height={36} iconSize={12} wrapperStyle={{fontSize: "12px"}}/>
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="gridVoltage"
          name="Grid Voltage"
          stroke="#63B3ED"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="anodeCurrent"
          name="Anode Current"
          stroke="#2DD4BF"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
