function rollingReturns(data: number[], days: number): number[] {
  const growthRate = data.map((e: number) => e + 1);
  let rollingReturns: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (!i) {
      rollingReturns.push(data[i]);
    } else if (i <= days) {
      const multipliers = growthRate.slice(0, i);
      let cumulativeReturn = 1;
      for (const multiplier of multipliers) {
        cumulativeReturn *= multiplier;
      }
      rollingReturns.push(cumulativeReturn - 1);
    } else {
      const multipliers = growthRate.slice(i - days, i);
      let cumulativeReturn = 1;
      for (const multiplier of multipliers) {
        cumulativeReturn *= multiplier;
      }
      rollingReturns.push(cumulativeReturn - 1);
    }
  }

  return rollingReturns;
}

export default rollingReturns;
