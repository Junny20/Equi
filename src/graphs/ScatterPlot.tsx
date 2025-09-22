import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  Tooltip,
  Title,
} from "chart.js";

import { Scatter } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import dailyReturns from "@/functions/dailyReturns";
import pearsonCorrelation from "@/functions/pearsonCorrelation";

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
  bars: [Bar[], Bar[]];
  stocksArr: string[];
};

export default function ScatterPlot({ bars, stocksArr }: Props) {
  const closingPrices1 = bars[0].map((e: Bar) => e.c);
  const closingPrices2 = bars[1].map((e: Bar) => e.c);

  const returns1 = dailyReturns(closingPrices1);
  const returns2 = dailyReturns(closingPrices2);

  const correlation = pearsonCorrelation(returns1, returns2);

  const data = returns1.map((e: number, i: number) => ({
    x: e,
    y: returns2[i],
  }));

  const chartData = {
    labels: bars[0].map((e: Bar) => new Date(e.t).toLocaleDateString()),
    datasets: [
      {
        label: `Returns of ${stocksArr[0]} vs returns of ${stocksArr[1]}`,
        data: data,
        backgroundColor: "rgba(75, 192, 95, 0.6)",
      },
    ],
  };

  const options: ChartOptions<"scatter"> = {
    plugins: {
      datalabels: {
        display: false,
      },
      title: {
        display: true,
        text: `Scatter Plot (Correlation: ${correlation.toFixed(2)})`,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            `(${ctx.parsed.x.toFixed(3)}, ${ctx.parsed.y.toFixed(3)})`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: `Returns of ${stocksArr[0]}`,
        },
      },
      y: {
        title: {
          display: true,
          text: `Returns of ${stocksArr[1]}`,
        },
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
}
