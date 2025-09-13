"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import type { ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  CandlestickController,
  CandlestickElement
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

export default function CandlestickChart({ bars }: { bars: Bar[] }) {
  const data = {
    datasets: [
      {
        label: "Stock Prices",
        data: bars.map((bar) => ({
          x: new Date(bar.t),
          o: bar.o,
          h: bar.h,
          l: bar.l,
          c: bar.c,
        })),
      },
    ],
  };

  const options: ChartOptions<"candlestick"> = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
          tooltipFormat: "HH:mm",
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Chart type="candlestick" data={data} options={options} />;
}
