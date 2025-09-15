import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  Tooltip,
  Title,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import dailyReturns from "@/functions/dailyReturns";
import rollingVol from "@/functions/rollingVolatility";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  Tooltip,
  Title,
  Legend
);

type Bar = {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: string;
  v: number;
  vw: number;
};

type Props = {
  bars: Bar[];
};

export default function VolatilityLineChart({ bars }: Props) {
  const closingPrices = bars.map((e: Bar) => e.c);
  const dailyReturnsArr = dailyReturns(closingPrices);

  const volData = {
    labels: bars.map((e: Bar) => new Date(e.t).toLocaleDateString()),
    datasets: [
      {
        label: "2-day rolling volatility",
        data: rollingVol(dailyReturnsArr, 2),
        borderColor: "rgba(67, 131, 67, 0.29)",
        backgroundColor: "rgba(99, 190, 99, 0.3)",
        tension: 0.2,
        fill: false,
      },
      {
        label: "10-day rolling volatility",
        data: rollingVol(dailyReturnsArr, 10),
        borderColor: "rgba(255,165,0,0.6)",
        backgroundColor: "rgba(255,165,0,0.3)",
        tension: 0.2,
        fill: false,
      },
      {
        label: "20-day rolling volatility",
        data: rollingVol(dailyReturnsArr, 20),
        borderColor: "rgba(193, 8, 45, 0.85)",
        backgroundColor: "rgba(220,20,60,0.3)",
        tension: 0.2,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Rolling Volatility of Stock",
        font: {
          size: 18,
        },
      },
      legend: {
        position: "top",
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: (val) => (val as number).toFixed(4),
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };
  return <Line data={volData} options={options} />;
}
