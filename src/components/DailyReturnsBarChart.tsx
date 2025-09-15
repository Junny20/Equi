import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import dailyReturns from "@/functions/dailyReturns";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

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

export default function DailyReturns({ bars }: Props) {
  const closingPrices = bars.map((e: Bar, i: number) => e.c);

  const dailyReturnsData = {
    labels: bars.map((e) => new Date(e.t).toLocaleDateString()),
    datasets: [
      {
        label: "Daily returns",
        data: dailyReturns(closingPrices),
        backgroundColor: dailyReturns(closingPrices).map((e: number) =>
          e > 0 ? "#75cc78ff" : "#e38e88ff"
        ),
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    plugins: {
      title: {
        display: true,
        text: "Daily returns of stock over time period",
      },
      legend: {
        display: false,
      },
    },
    scales: { y: { beginAtZero: false } },
  };
  return <Bar data={dailyReturnsData} options={options} />;
}
