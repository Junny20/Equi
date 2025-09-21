import mean from "./mean";

function volatility(data: number[], annualized: boolean = false): number {
  const avg = mean(data);
  const variance =
    data.reduce((sum, e) => sum + e ** 2, 0) / data.length - avg ** 2;
  const volatility = Math.sqrt(variance);

  if (annualized) {
    return volatility * Math.sqrt(252);
  }

  return volatility;
}

export default volatility;
