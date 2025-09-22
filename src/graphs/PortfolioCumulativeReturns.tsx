import cumulativeReturns from "@/functions/cumulativeReturns";
import dailyReturns from "@/functions/dailyReturns";

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

  let closingPricesArr: number[] = [];

  for (let i = 0; i < minLength; i++) {
    let totalValue = 0;
    for (let j = 0; j < bars.length; j++) {
      totalValue += bars[j][i].c * sharesArr[j];
    }
    closingPricesArr.push(totalValue);
  }

  const dailyReturnsArr = dailyReturns(closingPricesArr); // make a separate function

  const cumulativeReturnsArr = cumulativeReturns(dailyReturnsArr);

  let SPYclosingPrices: number[] = [];
  let SPYdailyReturns: number[] = [];
  let SPYcumulativeReturns: number[] = [];

  if (SPYbars && totalPrice) {
    SPYclosingPrices = SPYbars.map((e: Bar) => e.c);
    SPYdailyReturns = dailyReturns(SPYclosingPrices);
    SPYcumulativeReturns = cumulativeReturns(SPYdailyReturns);
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
      title: { display: true, text: "Cumulative returns of portfolio" },
    },
    elements: {
      point: {
        radius: 2,
      },
    },
  };

  return <Line data={data} options={options} />;
}
