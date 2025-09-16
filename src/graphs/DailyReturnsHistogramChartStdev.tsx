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
import volatility from "@/functions/volatility";

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

export default function DailyReturnsHistogramChartStdev({ bars }: Props) {
  const closingPrices = bars.map((e: Bar, i: number) => e.c);

  const dailyReturnsArr = dailyReturns(closingPrices);

  const mean =
    dailyReturnsArr.reduce((sum, e) => sum + e, 0) / dailyReturnsArr.length;

  const vol = volatility(dailyReturnsArr, false);

  const buckets = [
    mean - 3 * vol,
    mean - 2 * vol,
    mean - 1 * vol,
    mean,
    mean + 1 * vol,
    mean + 2 * vol,
    mean + 3 * vol,
  ];

  const bucketCounts = new Array(buckets.length + 1).fill(0);

  for (const e of dailyReturnsArr) {
    let placed = false;
    for (let i = 0; i < buckets.length; i++) {
      if (e < buckets[i]) {
        bucketCounts[i]++;
        placed = true;
        break;
      }
    }
    if (!placed) {
      bucketCounts[buckets.length]++; // anything beyond last bucket
    }
  }

  const histogramData = {
    labels: [
      `<${buckets[0].toFixed(3)}`,
      `${buckets[0].toFixed(3)} to ${buckets[1].toFixed(3)}`,
      `${buckets[1].toFixed(3)} to ${buckets[2].toFixed(3)}`,
      `${buckets[2].toFixed(3)} to ${buckets[3].toFixed(3)}`,
      `${buckets[3].toFixed(3)} to ${buckets[4].toFixed(3)}`,
      `${buckets[4].toFixed(3)} to ${buckets[5].toFixed(3)}`,
      `${buckets[5].toFixed(3)} to ${buckets[6].toFixed(3)}`,
      `>${buckets[6].toFixed(3)}`,
    ],
    datasets: [
      {
        label: "Frequency",
        data: bucketCounts,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    plugins: {
      title: {
        display: true,
        text: "Histogram of stock's daily returns over time period separated using standard deviation of returns",
      },
      legend: {
        display: false,
      },
    },
  };

  return <Bar data={histogramData} options={options} />;
}
