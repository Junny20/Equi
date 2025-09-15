function dailyReturns(closingPrices: number[]): number[] {
  const dr = closingPrices.map((e: number, i: number) => {
    if (i) {
      return (e - closingPrices[i - 1]) / closingPrices[i - 1];
    }
    return 0;
  });

  return dr;
}

export default dailyReturns;
