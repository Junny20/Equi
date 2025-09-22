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
import volatility from "@/functions/volatility";
import mean from "@/functions/mean";

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
};

export default function PortfolioReturnVolatilityScatterPlot({
  bars,
  sharesArr,
}: Props) {
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

  const meanReturn = mean(dailyReturnsArr);

  const annualReturn = meanReturn * 252;
  const vol = volatility(dailyReturnsArr, true);
}
