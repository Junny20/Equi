"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import type { ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
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

type Props = {
  bars: Bar[];
};

export default function CandlestickChart({ bars }: Props) {
  const dates = bars.map((bar: Bar, i: number) => {
    // const date = new Date(bar.t);
    // const year = date.getFullYear();
    // const month = date.getMonth();
    // const day = date.getDate();
    // const hour = date.getHours();
    // const min = date.getMinutes();

    // if (mode === "D") {
    //   return `${day}, ${hour}:${min}`;
    // } else if (mode === "M") {
    //   return `${month + 1}/${day},${hour}:${min}`;
    // } else if (mode === "Y") {
    //   return `${year}${month + 1}/${day},${hour}:${min}`;
    // }
    const date = new Date(bar.t);
    // return date.toISOString();
    return i;
  });

  const candlestickData = {
    labels: dates,
    datasets: [
      {
        label: "Stock prices",
        data: bars.map((bar: Bar, i: number) => ({
          x: dates[i],
          o: bar.o,
          h: bar.h,
          l: bar.l,
          c: bar.c,
        })),
        barThickness: 4,
      },
    ],
  };

  const options: ChartOptions<"candlestick"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "OHLC Data of stock over time period",
      },
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Chart type="candlestick" data={candlestickData} options={options} />;
}
