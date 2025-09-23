import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  Tooltip,
  Title,
} from "chart.js";

import { Scatter } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

import mean from "@/functions/mean";
import dailyReturns from "@/functions/dailyReturns";
import rollingReturns from "@/functions/rollingReturns";
import rollingVol from "@/functions/rollingVolatility";
import portfolioClosingPrices from "@/functions/portfolioClosingPrices";

ChartJS.register(CategoryScale, PointElement, Tooltip, Title);

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
};

type ScatterPoint = {
  x: number;
  y: number;
};

export default function PortfolioReturnVolatilityScatterPlot({
  bars,
  sharesArr,
  SPYbars,
}: Props) {
  const minLength = Math.min(...bars.map((e: Bar[]) => e.length));
  let minIndex = 0;
  for (let i = 0; i < bars.length; i++) {
    if (bars[i].length === minLength) {
      minIndex = i;
    }
  }

  const rollingWindowLength: number = 63;

  const closingPricesArr = portfolioClosingPrices(bars, minLength, sharesArr);
  const dailyReturnsArr = dailyReturns(closingPricesArr);
  const rollingReturnsArr = rollingReturns(
    dailyReturnsArr,
    rollingWindowLength
  );
  const rollingVolatilityArr = rollingVol(dailyReturnsArr, rollingWindowLength);

  const avgReturn = mean(rollingReturnsArr);
  const avgVol = mean(rollingVolatilityArr);

  const data: ScatterPoint[] = rollingReturnsArr.map((e: number, i: number) => {
    return {
      x: e,
      y: rollingVolatilityArr[i],
    };
  });

  let SPYclosingPrices: number[] = [];
  let SPYdailyReturns: number[] = [];
  let SPYrollingReturns: number[] = [];
  let SPYrollingVol: number[] = [];
  let SPYdata: ScatterPoint[] = [];

  let SPYavgReturn: number = 0;
  let SPYavgVol: number = 0;

  if (SPYbars) {
    SPYclosingPrices = SPYbars.map((e: Bar) => e.c);
    SPYdailyReturns = dailyReturns(SPYclosingPrices);
    SPYrollingReturns = rollingReturns(SPYdailyReturns, rollingWindowLength);
    SPYrollingVol = rollingVol(SPYdailyReturns, rollingWindowLength);
    SPYdata = SPYrollingReturns.map((e: number, i: number) => {
      return {
        x: e,
        y: SPYrollingVol[i],
      };
    });

    SPYavgReturn = mean(SPYrollingReturns);
    SPYavgVol = mean(SPYrollingVol);
  }

  const dates = bars[minIndex].map((e: Bar) =>
    new Date(e.t).toLocaleDateString()
  );

  const scatterData: ChartData<"scatter"> = {
    labels: dates,
    datasets: [
      {
        label: "Portfolio mean return/volatility",
        data: [{ x: avgReturn, y: avgVol }],
        backgroundColor: "rgba(0,0,255,0.5)",
        pointRadius: 3,
      },
      {
        label: "Portfolio returns/volatility",
        data: data,
        backgroundColor: "rgba(139, 19, 169, 0.5)",
        pointRadius: 3,
      },
      ...(SPYbars
        ? [
            {
              label: "S&P 500 mean return/volatility",
              data: [{ x: SPYavgReturn, y: SPYavgVol }],
              backgroundColor: "rgba(26, 201, 26, 0.5)",
              pointRadius: 3,
            },
          ]
        : []),
      ...(SPYbars
        ? [
            {
              label: "S&P 500 returns/volatility",
              data: SPYdata,
              backgroundColor: "rgba(201, 177, 26, 0.5)",
              pointRadius: 3,
            },
          ]
        : []),
    ],
  };

  const options: ChartOptions<"scatter"> = {
    plugins: {
      datalabels: {
        display: false,
      },
      title: {
        display: true,
        text: `Scatter Plot (Rolling cumulative return vs rolling volatility)`,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            `Return: ${(ctx.parsed.x * 100).toFixed(3)}%, Volatility: ${(
              ctx.parsed.y * 100
            ).toFixed(3)}%`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: `${rollingWindowLength}-day rolling cumulative return of Portfolio`,
        },
      },
      y: {
        title: {
          display: true,
          text: `${rollingWindowLength}-day rolling volatilty of Portfolio`,
        },
      },
    },
  };

  return <Scatter data={scatterData} options={options} />;
}
