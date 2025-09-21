import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
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
  bars: Bar[][];
  stocksArr: string[];
  sharesArr: number[];
};

export default function PortfolioValueChart({
  bars,
  stocksArr,
  sharesArr,
}: Props) {
  const dates: string[] = bars[0].map((e: Bar) =>
    new Date(e.t).toLocaleDateString()
  );

  console.log(sharesArr);

  const values = bars[0].map((_: Bar, i: number) => {
    let total = 0;
    for (let j = 0; j < bars.length; j++) {
      console.log(bars[j][i].c * sharesArr[j]);
      total += bars[j][i].c * sharesArr[j];
    }

    return total;
  });

  const data = {
    labels: dates,
    datasets: [
      {
        data: values,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.2,
        fill: false,
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
        text: "Portfolio value over a year",
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
      y: {
        display: true,
        beginAtZero: false,
      },
    },
    elements: {
      point: {
        radius: 2,
      },
    },
  };

  return <Line data={data} options={options} />;
}
