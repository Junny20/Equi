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

import portfolioClosingPrices from "@/functions/portfolioClosingPrices";
import dailyReturns from "@/functions/dailyReturns";
import rollingMeanReturns from "@/functions/rollingMeanReturns";
import rollingVol from "@/functions/rollingVolatility";

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

export default function PortfolioSharpeRatio({ bars, sharesArr }: Props) {
  const minLength = Math.min(...bars.map((e: Bar[]) => e.length));
  let minIndex = 0;
  for (let i = 0; i < bars.length; i++) {
    if (bars[i].length === minLength) {
      minIndex = i;
    }
  }

  const rollingWindowLength = 63;

  const closingPricesArr: number[] = portfolioClosingPrices(
    bars,
    minLength,
    sharesArr
  );

  const dailyReturnsArr: number[] = dailyReturns(closingPricesArr);

  const rollingMeanReturnsArr: number[] = rollingMeanReturns(
    dailyReturnsArr,
    rollingWindowLength
  );
  const rollingVolatilityArr: number[] = rollingVol(
    dailyReturnsArr,
    rollingWindowLength
  );
  const annualizedSharpeRatioArr: number[] = rollingMeanReturnsArr.map(
    (e: number, i: number) => (e / rollingVolatilityArr[i]) * Math.sqrt(252)
  );

  const dates = bars[minIndex].map((e: Bar) =>
    new Date(e.t).toLocaleDateString()
  );

  const data: ChartData<"line"> = {
    labels: dates,
    datasets: [
      {
        label: "Annualized sharpe ratio",
        data: annualizedSharpeRatioArr,
        borderColor: "rgba(23, 210, 175, 0.5)",
      },
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
      title: {
        display: true,
        text: "Annualized sharpe ratio of portfolio",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Annualized sharpe ratio",
        },
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
