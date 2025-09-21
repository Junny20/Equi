import {
  Chart as ChartJS,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";

import { Chart } from "react-chartjs-2";
import type { ChartOptions, ChartData } from "chart.js";

import mean from "@/functions/mean";
import dailyReturns from "@/functions/dailyReturns";
import volatility from "@/functions/volatility";

ChartJS.register(
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
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

export default function DailyReturnsHistogramChartStdev({ bars }: Props) {
  const closingPrices = bars.map((e) => e.c);
  const dailyReturnsArr = dailyReturns(closingPrices);

  const avg = mean(dailyReturnsArr);
  const vol = volatility(dailyReturnsArr);

  const sigmaEdges = [-3, -2, -1, 0, 1, 2, 3].map((s) => avg + s * vol);

  const bucketCounts = new Array(sigmaEdges.length + 1).fill(0);

  for (const r of dailyReturnsArr) {
    const idx = sigmaEdges.findIndex((edge) => r < edge);
    bucketCounts[idx === -1 ? sigmaEdges.length : idx]++;
  }

  const bucketPercentages = bucketCounts.map(
    (count) => (count / dailyReturnsArr.length) * 100
  );

  const bucketMidpoints: number[] = [];
  for (let i = 0; i <= sigmaEdges.length; i++) {
    const left = i === 0 ? avg - 3 * vol : sigmaEdges[i - 1];
    const right = i === sigmaEdges.length ? avg + 3 * vol : sigmaEdges[i];
    bucketMidpoints.push((left + right) / 2);
  }

  const labels = bucketMidpoints.map((mid, i) =>
    i === 0
      ? `<${sigmaEdges[0].toFixed(3)}`
      : i === sigmaEdges.length
      ? `>${sigmaEdges[sigmaEdges.length - 1].toFixed(3)}`
      : `${sigmaEdges[i - 1].toFixed(3)} to ${sigmaEdges[i].toFixed(3)}`
  );

  const histogramData: ChartData<"bar" | "line"> = {
    labels: labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Frequency (%)",
        data: bucketPercentages.map((y, i) => ({ x: bucketMidpoints[i], y })),
        backgroundColor: "rgba(56, 140, 200, 0.66)",
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Histogram of Daily Returns (with Std Dev Buckets & Normal Overlay)",
      },
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const p = ctx.raw as { x: number; y: number };
            return `${p.y.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Daily Return" },
      },
      y: {
        title: { display: true, text: "Frequency (%)" },
      },
    },
  };

  return <Chart type="bar" data={histogramData} options={options} />;
}
