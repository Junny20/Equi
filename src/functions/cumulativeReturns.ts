function cumulativeReturns(data: number[]) {
  // dailyReturns
  const growthRate = data.map((e: number) => e + 1);
  let cumulativeReturns: number[] = [];

  for (let i = 0; i < growthRate.length; i++) {
    if (!cumulativeReturns.length) {
      cumulativeReturns.push(growthRate[i]);
    } else {
      cumulativeReturns.push(cumulativeReturns[i - 1] * growthRate[i]);
    }
  }

  return cumulativeReturns.map((e: number) => e - 1);
}

export default cumulativeReturns;
