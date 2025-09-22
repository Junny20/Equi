import dailyReturns from "@/functions/dailyReturns";
import mean from "@/functions/mean";
import volatility from "@/functions/volatility";

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
import { Chart } from "react-chartjs-2";

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
};

export default function PortfolioDailyReturns({ bars, sharesArr }: Props) {
  const minLength = Math.min(...bars.map((e: Bar[]) => e.length));

  let closingPricesArr: number[] = [];

  for (let i = 0; i < minLength; i++) {
    let totalValue = 0;
    for (let j = 0; j < bars.length; j++) {
      totalValue += bars[j][i].c * sharesArr[j];
    }
    closingPricesArr.push(totalValue);
  }

  const dailyReturnsArr = dailyReturns(closingPricesArr); // make a separate function

  var numBins = Math.round(Math.sqrt(dailyReturnsArr.length));
  if (numBins % 2 === 1) {
    numBins += 1;
  }

  const maxAbs = Math.max(...dailyReturnsArr.map((e: number) => Math.abs(e)));
  const binWidth = (2 * maxAbs) / numBins;

  const bins = Array.from(
    { length: numBins },
    (_, i: number) => -maxAbs + i * binWidth
  );
  const counts = new Array(numBins).fill(0);

  for (const e of dailyReturnsArr) {
    const binIndex = Math.min(Math.floor((e + maxAbs) / binWidth), numBins - 1);
    console.log(binIndex);
    counts[binIndex]++;
  }

  const frequencies = counts.map(
    (e: number) => (e / dailyReturnsArr.length) * 100
  );

  const avg = mean(dailyReturnsArr);
  const stdev = volatility(dailyReturnsArr);

  const binCenters = bins.map((b) => b + binWidth / 2);

  let normalScaled: number[] = [];
  if (stdev > 0) {
    const normalPdf = binCenters.map(
      (x) =>
        (1 / (stdev * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * ((x - avg) / stdev) ** 2)
    );

    normalScaled = normalPdf.map((y) => y * binWidth * 100);
  } else {
    normalScaled = new Array(binCenters.length).fill(0);
  }

  const labels = bins.map((e: number, i: number) =>
    i === bins.length - 1
      ? `${(e * 100).toFixed(2)}%+`
      : `${(e * 100).toFixed(2)}% to ${((e + binWidth) * 100).toFixed(2)}%`
  );

  const histogramData: ChartData<"bar" | "line"> = {
    labels: labels,
    datasets: [
      {
        type: "line" as const,
        label: "Normal Curve",
        data: normalScaled,
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0.2,
      },
      {
        label: "Daily returns of portfolio",
        data: frequencies,
        backgroundColor: "rgba(54, 187, 235, 1)",
        categoryPercentage: 1.0,
        barPercentage: 1.0,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    plugins: {
      datalabels: {
        display: false,
      },
      title: {
        display: true,
        text: "Histogram of Daily Returns (with Normal Overlay)",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Daily Return (%)",
        },
        stacked: true,
      },
      y: {
        title: {
          display: true,
          text: "Frequency (%)",
        },
      },
    },
  };

  return <Chart type="bar" data={histogramData} options={options} />;
}
