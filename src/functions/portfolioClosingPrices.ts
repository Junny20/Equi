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

function portfolioClosingPrices(
  bars: Bar[][],
  minLength: number,
  sharesArr: number[]
) {
  let closingPricesArr: number[] = [];

  for (let i = 0; i < minLength; i++) {
    let totalValue = 0;
    for (let j = 0; j < bars.length; j++) {
      totalValue += bars[j][i].c * sharesArr[j];
    }
    closingPricesArr.push(totalValue);
  }

  return closingPricesArr;
}

export default portfolioClosingPrices;
