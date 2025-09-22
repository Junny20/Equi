import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import type { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
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
  sharesArr: number[];
};

export default function PortfolioDrawdownChart({ bars, sharesArr }: Props) {
  const minLength = Math.min(...bars.map((e: Bar[]) => e.length));
  let minIndex = 0;

  for (let i = 0; i < bars.length; i++) {
    if (bars[i].length === minLength) {
      minIndex = i;
    }
  }

  let totalValueArr: number[] = [];

  for (let i = 0; i < minLength; i++) {
    let totalValue = 0;
    for (let j = 0; j < bars.length; j++) {
      totalValue += bars[j][i].c * sharesArr[j];
    }
    totalValueArr.push(totalValue);
  }

  let peakValueArr: number[] = [];

  for (let i = 0; i < totalValueArr.length + 1; i++) {
    peakValueArr.push(Math.max(...totalValueArr.slice(0, i)));
  }

  let drawdownArr: number[] = [];

  for (let i = 0; i < totalValueArr.length; i++) {
    drawdownArr.push((totalValueArr[i] - peakValueArr[i]) / peakValueArr[i]);
  }

  const maxDD = Math.min(...drawdownArr);
  const maxDDIndex = drawdownArr.indexOf(maxDD);

  const dates = bars[minIndex].map((e: Bar) =>
    new Date(e.t).toLocaleDateString()
  );

  const data: ChartData<"line"> = {
    labels: dates,
    datasets: [
      {
        label: "Drawdown",
        data: drawdownArr,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    plugins: {
      datalabels: {
        display: false,
      },
      title: {
        display: true,
        text: "Drawdown chart",
      },
    },
    scales: {
      x: {
        type: "category",
        title: { display: true, text: "Date" },
      },
      y: {
        title: { display: true, text: "Drawdown (%)" },
        beginAtZero: false,
      },
    },
  };

  return <Line data={data} options={options} />;
}
