import dailyReturns from "@/functions/dailyReturns";
import pearsonCorrelation from "@/functions/pearsonCorrelation";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { MatrixElement, MatrixController } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  MatrixElement,
  MatrixController
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
};

export default function Heatmap({ bars, stocksArr }: Props) {
  const closingPricesArr: number[][] = bars.map((e: Bar[]) =>
    e.map((v: Bar) => v.c)
  );
  const dailyReturnsArr: number[][] = closingPricesArr.map((e: number[]) =>
    dailyReturns(e)
  );

  const nstocks = stocksArr.length;

  const correlationMatrix = Array.from({ length: nstocks }, () =>
    Array.from({ length: nstocks }).fill(0)
  );

  for (let i = 0; i < nstocks; i++) {
    for (let j = 0; j < nstocks; j++) {
      const correlation = pearsonCorrelation(
        dailyReturnsArr[i],
        dailyReturnsArr[j]
      );
      correlationMatrix[i][j] = correlation;
    }
  } //make its own function

  let heatmapData = [];
  for (let i = 0; i < nstocks; i++) {
    for (let j = 0; j < nstocks; j++) {
      heatmapData.push({
        x: i,
        y: j, //heatmap expects indices (not str)
        v: correlationMatrix[i][j],
      });
    }
  }

  const heatmapChartData = {
    labels: stocksArr,
    datasets: [
      {
        label: "Correlation heatmap",
        data: heatmapData,
        backgroundColor: (ctx: any) => {
          const value = ctx.dataset.data[ctx.dataIndex].v;
          const green = Math.floor(((value + 1) / 2) * 255);
          const red = 255 - green;
          return `rgb(${red}, ${green}, 0)`;
        },
        width: ({ chart }: any) => chart.chartArea.width / nstocks - 1,
        height: ({ chart }: any) => chart.chartArea.height / nstocks - 1,
      },
    ],
  };

  const options: ChartOptions<"matrix"> = {
    scales: {
      x: {
        type: "category",
        labels: stocksArr,
      },
      y: {
        type: "category",
        labels: stocksArr,
      },
    },
  };

  return <Chart type="matrix" data={heatmapChartData} options={options} />;
}
