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

export default function PortfolioDrawdownChart({
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

  let totalValueArr: number[] = [];

  for (let i = 0; i < minLength; i++) {
    let totalValue = 0;
    for (let j = 0; j < bars.length; j++) {
      totalValue += bars[j][i].c * sharesArr[j];
    }
    totalValueArr.push(totalValue);
  }

  let peakValueArr: number[] = [];

  for (let i = 0; i < totalValueArr.length; i++) {
    if (!peakValueArr.length) {
      peakValueArr.push(totalValueArr[i]);
    } else {
      peakValueArr.push(
        Math.max(peakValueArr[peakValueArr.length - 1], totalValueArr[i])
      );
    }
  }

  let drawdownArr: number[] = [];

  for (let i = 0; i < totalValueArr.length; i++) {
    drawdownArr.push((totalValueArr[i] - peakValueArr[i]) / peakValueArr[i]);
  }

  let SPYclosingPrices: number[] = [];
  let SPYtotalShares: number = 0;
  let SPYpeakValue: number[] = [];
  let SPYdrawdown: number[] = [];

  if (SPYbars && totalPrice) {
    SPYclosingPrices = SPYbars.map((e: Bar) => e.c);
    SPYtotalShares = totalValueArr[0] / SPYclosingPrices[0];

    for (let i = 0; i < SPYclosingPrices.length; i++) {
      if (!SPYpeakValue.length) {
        SPYpeakValue.push(SPYclosingPrices[i] * SPYtotalShares);
      } else {
        SPYpeakValue.push(
          Math.max(
            SPYpeakValue[SPYpeakValue.length - 1],
            SPYclosingPrices[i] * SPYtotalShares
          )
        );
      }
    }

    for (let i = 0; i < SPYpeakValue.length; i++) {
      SPYdrawdown.push(
        (SPYclosingPrices[i] * SPYtotalShares - SPYpeakValue[i]) /
          SPYpeakValue[i]
      );
    }
  }

  const dates = bars[minIndex].map((e: Bar) =>
    new Date(e.t).toLocaleDateString()
  );

  const data: ChartData<"line"> = {
    labels: dates,
    datasets: [
      {
        label: "Drawdown",
        data: drawdownArr,
        borderColor: "rgba(227, 29, 29, 0.5)",
      },
      ...(SPYbars && totalPrice
        ? [
            {
              label: "S&P 500 Drawdown",
              data: SPYdrawdown,
              borderColor: "rgba(220, 227, 29, 0.5)",
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
        text: "Drawdown chart",
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        type: "category",
      },
      y: {
        title: { display: true, text: "Drawdown (%)" },
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
