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

type HeatmapPoint = { x: number; y: number; v: number };

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
        x: stocksArr[i],
        y: stocksArr[j],
        v: correlationMatrix[i][j],
      });
    }
  }

  console.log(heatmapData);

  const heatmapChartData = {
    labels: stocksArr,
    datasets: [
      {
        data: heatmapData,
        backgroundColor: (ctx: any) => {
          const correlation = ctx.dataset.data[ctx.dataIndex].v;

          const normalizedCorrelation = (correlation + 1) / 2;

          const r = Math.round(94 + (236 - 94) * normalizedCorrelation);
          const g = Math.round(79 + (165 - 79) * normalizedCorrelation);
          const b = Math.round(162 + (14 - 162) * normalizedCorrelation);

          return `rgb(${r}, ${g}, ${b})`;
        },
        width: ({ chart }: any) =>
          chart.chartArea ? chart.chartArea.width / nstocks : 0,
        height: ({ chart }: any) =>
          chart.chartArea ? chart.chartArea.height / nstocks : 0,
      },
    ],
  };

  const options: ChartOptions<"matrix"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Correlation matrix of stocks",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const point = ctx.raw as HeatmapPoint;
            return `Correlation: ${point.v.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        labels: stocksArr,
        grid: {
          display: false,
        },
      },
      y: {
        type: "category",
        offset: true,
        labels: stocksArr,
        grid: { display: false },
        reverse: true,
      },
    },
  };

  return <Chart type="matrix" data={heatmapChartData} options={options} />;
}
