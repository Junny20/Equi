import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import dailyReturns from "@/functions/dailyReturns";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

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

export default function DailyReturnsHistogramChartEven({ bars }: Props) {
  const closingPrices = bars.map((e: Bar, i: number) => e.c);

  const dailyReturnsArr = dailyReturns(closingPrices);

  const min = Math.min(...dailyReturnsArr);
  const max = Math.max(...dailyReturnsArr);
  const numBins = 10;

  const binWidth = (max - min) / numBins;
  const bins = Array.from({ length: numBins }, (e, i) => min + i * binWidth);
  const counts = new Array(numBins).fill(0);

  for (const e of dailyReturnsArr) {
    const binIndex = Math.min(Math.floor((e - min) / binWidth), numBins - 1);
    counts[binIndex]++;
  }

  const labels = bins.map((b, i) =>
    i < bins.length - 1
      ? `${b.toFixed(3)} to ${(b + binWidth).toFixed(3)}`
      : `${b.toFixed(3)}+`
  );

  const histogramData = {
    labels: labels,
    datasets: [
      {
        label: "Frequency",
        data: counts,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    plugins: {
      title: {
        display: true,
        text: "Histogram of stock's daily returns over time period sorted using linear range",
      },
      legend: {
        display: false,
      },
    },
  };

  return <Bar data={histogramData} options={options} />;
}
