import volatility from "./volatility";

function rollingVol(data: number[], days: number): number[] {
  let rollingVolArr: number[] = [];
  const dataLength = data.length;
  var end = 1;
  while (end <= dataLength) {
    if (end - days < 0) {
      rollingVolArr.push(NaN);
    } else {
      const stdev = volatility(data.slice(end - days, end));
      rollingVolArr.push(stdev);
    }
    end++;
  }
  return rollingVolArr;
}

export default rollingVol;
