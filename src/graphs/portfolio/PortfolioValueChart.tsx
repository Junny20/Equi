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
import annotationPlugin from "chartjs-plugin-annotation";

import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

import portfolioClosingPrices from "@/functions/portfolioClosingPrices";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Title,
  Legend,
  annotationPlugin
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

  const closingPricesArr: number[] = portfolioClosingPrices(
    bars,
    minLength,
    sharesArr
  );

  let SPYclosingPrices: number[] = [];
  let SPYtotalShares: number = 0;

  if (SPYbars && totalPrice) {
    SPYclosingPrices = SPYbars.map((e: Bar) => e.c);
    SPYtotalShares = closingPricesArr[0] / SPYclosingPrices[0];
  }

  const dates: string[] = bars[minIndex].map((e: Bar) =>
    new Date(e.t).toLocaleDateString()
  );

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Portfolio",
        data: closingPricesArr,
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
      annotation: {
        annotations: {
          zeroLine: {
            type: "line",
            yMin: closingPricesArr[0],
            yMax: closingPricesArr[0],
            borderWidth: 1,
            borderColor: "rgba(227, 29, 29, 0.5)",
          },
        },
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
        radius: 1,
      },
    },
  };

  return <Line data={data} options={options} />;
}
