'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ChartDataItem {
  date: string;
  count: number;
}

interface ReportMetricsChartProps {
  data: ChartDataItem[];
}

export default function ReportMetricsChart({ data }: ReportMetricsChartProps) {
  // 차트 데이터 포맷 변환
  const formattedData = data.map((item) => ({
    date: item.date.split('-').slice(1).join('/'), // "2025-03-01" => "03/01"
    신고건수: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={formattedData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="신고건수"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
