import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  PointElement,
  Tooltip,
  Title,
  Legend,
  LinearScale,
} from "chart.js";

import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import dailyReturns from "@/functions/dailyReturns";

ChartJS.register(
  LineElement,
  CategoryScale,
  PointElement,
  Tooltip,
  Title,
  Legend,
  LinearScale
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
  bars: Bar[][];
  stocksArr: string[];
  returns?: boolean;
};

export default function MultipleStockLineChart({
  bars,
  stocksArr,
  returns,
}: Props) {
  const dates = bars[0].map((e: Bar) => new Date(e.t));
  let datasets = [];

  for (var i = 0; i < stocksArr.length; i++) {
    let dataset;
    const closingPrices = bars[i].map((e: Bar) => e.c);
    if (returns) {
      const dailyReturnsArr = dailyReturns(closingPrices);
      dataset = { label: stocksArr[i], data: dailyReturnsArr };
    } else {
      dataset = { label: stocksArr[i], data: closingPrices };
    }

    datasets.push(dataset);
  }

  const data = {
    labels: dates.map((e: Date) => e.toLocaleDateString()),
    datasets: datasets,
  };
  const options: ChartOptions<"line"> = {
    plugins: {
      datalabels: {
        display: false,
      },
      title: {
        display: true,
        text: returns
          ? "Interval based returns of stock over time period"
          : "Interval based closing prices of stock over time period",
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
          callback: (e) => (e as number).toFixed(4),
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };
  return <Line data={data} options={options} />;
}
