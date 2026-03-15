'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GoalPieChartProps {
    current: number;
    target: number;
    color: string;
    label: string;
}

const GoalPieChart = ({ current, target, color, label }: GoalPieChartProps) => {
    const data = [
        { name: 'Completed', value: Math.min(current, target) },
        { name: 'Remaining', value: Math.max(0, target - current) },
    ];

    // Map Tailwind color classes to hex for Recharts
    const colorMap: { [key: string]: string } = {
        'bg-blue-500': '#3b82f6',
        'bg-purple-500': '#a855f7',
        'bg-green-500': '#22c55e',
        'bg-yellow-500': '#eab308',
    };

    const activeColor = colorMap[color] || '#3b82f6';
    const pct = Math.min(100, Math.round((current / target) * 100));

    return (
        <div className="flex flex-col items-center gap-2 p-4 bg-[#1c1c24] rounded-2xl border border-white/5 min-w-[160px] shrink-0 hover:border-white/10 transition-colors group">
            <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={30}
                            outerRadius={40}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            <Cell key="completed" fill={activeColor} />
                            <Cell key="remaining" fill="rgba(255, 255, 255, 0.05)" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-white">{pct}%</span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-xs font-bold text-white truncate w-full max-w-[140px]">{label}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                    {current.toLocaleString()} / {target.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default GoalPieChart;
