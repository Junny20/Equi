import cumulativeReturns from "@/functions/cumulativeReturns";
import dailyReturns from "@/functions/dailyReturns";
import portfolioClosingPrices from "@/functions/portfolioClosingPrices";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

import type { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
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

export default function PortfolioCumulativeReturns({
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

  const dailyReturnsArr: number[] = dailyReturns(closingPricesArr);

  const cumulativeReturnsArr: number[] = cumulativeReturns(dailyReturnsArr).map(
    (e: number) => e * 100
  ); //percentage

  let SPYclosingPrices: number[] = [];
  let SPYdailyReturns: number[] = [];
  let SPYcumulativeReturns: number[] = [];

  if (SPYbars && totalPrice) {
    SPYclosingPrices = SPYbars.map((e: Bar) => e.c);
    SPYdailyReturns = dailyReturns(SPYclosingPrices);
    SPYcumulativeReturns = cumulativeReturns(SPYdailyReturns).map(
      (e: number) => e * 100
    ); // possibly add parameter to function that maps to percentage instead of doing it here
  }

  const dates = bars[minIndex].map((e: Bar) =>
    new Date(e.t).toLocaleDateString()
  );

  const data: ChartData<"line"> = {
    labels: dates,
    datasets: [
      {
        label: "Cumulative returns",
        data: cumulativeReturnsArr,
        borderColor: "rgba(227, 161, 29, 0.5)",
        tension: 0.2,
      },
      ...(SPYbars && totalPrice
        ? [
            {
              label: "S&P 500 Cumulative returns",
              data: SPYcumulativeReturns,
              borderColor: "rgba(227, 121, 29, 0.5)",
              tension: 0.2,
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
            yMin: 0,
            yMax: 0,
            borderColor: "red",
            borderWidth: 0.6,
          },
        },
      },
      title: { display: true, text: "Cumulative returns of portfolio" },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `Cumulative returns: ${ctx.raw.toFixed(3)}%`,
        },
      },
    },
    elements: {
      point: {
        radius: 1,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Cumulative return (%)",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
