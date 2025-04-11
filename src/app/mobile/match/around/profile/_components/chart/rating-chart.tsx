'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const winrateData = [
  { label: '월', winrate: 60 },
  { label: '화', winrate: 80 },
  { label: '수', winrate: 40 },
  { label: '목', winrate: 90 },
  { label: '금', winrate: 65 },
];

export default function RatingChart() {
  // 평균 승률 계산
  const avgWinrate =
    winrateData.reduce((acc, cur) => acc + cur.winrate, 0) / winrateData.length;

  return (
    <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-1 text-lg font-bold text-gray-800">게임 승률</div>
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <span>전체 평균: </span>
        <span className="ml-1 font-bold text-blue-600">
          {avgWinrate.toFixed(1)}%
        </span>
      </div>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={winrateData}
            margin={{ top: 20, right: 10, bottom: 10, left: 10 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              tickFormatter={(tick) => `${tick}%`}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, '승률']}
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                border: 'none',
              }}
            />
            <Bar
              dataKey="winrate"
              fill="#60a5fa"
              radius={[8, 8, 0, 0]}
              barSize={36}
            >
              <LabelList
                dataKey="winrate"
                position="top"
                formatter={(v: any) => `${v}%`}
                style={{
                  fill: '#60a5fa',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
