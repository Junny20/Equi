import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

import type { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import rollingAvg from "@/functions/movingAverage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Title,
  Tooltip
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

export default function LineChart({ bars }: Props) {
  const closingPrices = bars.map((e: Bar, i: number) => e.c);

  const lineData = {
    labels: bars.map((e) => new Date(e.t).toLocaleDateString()),
    datasets: [
      {
        label: "Price point",
        data: closingPrices,
        borderColor: "#4536ebff",
        backgroundColor: "#a09bf5ff",
        tension: 0.2,
        fill: false,
      },
      {
        label: "10 point moving average",
        data: rollingAvg(closingPrices, 10),
        borderColor: "#36A2EB",
        backgroundColor: "#9BD0F5",
        tension: 0.2,
        fill: false,
      },
      {
        label: "20 point moving average",
        data: rollingAvg(closingPrices, 20),
        borderColor: "#63ffedff",
        backgroundColor: "#b1fcffff",
      },
      {
        label: "50 point moving average",
        data: rollingAvg(closingPrices, 50),
        borderColor: "#52ff5eff",
        backgroundColor: "#b7ffb1ff",
        tension: 0.2,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    plugins: {
      title: {
        display: true,
        text: "Closing Price of stock over time period",
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

  return <Line data={lineData} options={options} />;
}
