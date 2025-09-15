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
import movingAverage from "@/functions/movingAverage";

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
      },
      {
        label: "10 day moving average",
        data: movingAverage(closingPrices, 10),
        borderColor: "#36A2EB",
        backgroundColor: "#9BD0F5",
      },
      {
        label: "20 day moving average",
        data: movingAverage(closingPrices, 20),
        borderColor: "#63ffedff",
        backgroundColor: "#b1fcffff",
      },
      {
        label: "50 day moving average",
        data: movingAverage(closingPrices, 50),
        borderColor: "#52ff5eff",
        backgroundColor: "#b7ffb1ff",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    plugins: {
      title: {
        display: true,
        text: "Closing Price of stock over time period",
      },
    },
  };

  return <Line data={lineData} options={options} />;
}
