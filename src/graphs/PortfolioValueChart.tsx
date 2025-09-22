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
  sharesArr: number[];
  SPYbars?: Bar[] | null;
  totalPrice?: number;
};

export default function PortfolioValueChart({
  bars,
  sharesArr,
  SPYbars,
  totalPrice,
}: Props) {
  const minLength = Math.min(...bars.map((e: Bar[]) => e.length));
  let minIndex = 0;

  for (let i = 0; i < bars.length; i++) {
    if (bars[i].length === minLength) {
      minIndex = i;
    }
  }

  const values = bars[minIndex].map((_: Bar, i: number) => {
    let total = 0;
    for (let j = 0; j < bars.length; j++) {
      total += bars[j][i].c * sharesArr[j];
    }

    return total;
  });

  let SPYclosingPrices: number[] = [];
  let SPYtotalShares: number = 0;

  if (SPYbars && totalPrice) {
    SPYclosingPrices = SPYbars.map((e: Bar) => e.c);
    SPYtotalShares = values[0] / SPYclosingPrices[0];
  }

  const dates: string[] = bars[minIndex].map((e: Bar) =>
    new Date(e.t).toLocaleDateString()
  );

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Portfolio",
        data: values,
        borderColor: "rgba(75, 192, 192, 0.5)",
      },
      ...(SPYbars && SPYclosingPrices.length > 0
        ? [
            {
              label: "S&P 500 Benchmark",
              data: SPYclosingPrices?.map((e: number) => e * SPYtotalShares),
              borderColor: "rgba(87, 192, 75, 0.5)",
            },
          ]
        : []),
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
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Value ($)",
        },
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
