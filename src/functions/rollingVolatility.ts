import volatility from "./volatility";

function rollingVol(data: number[], days: number): number[] {
  let rollingVolArr: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const windowStart = i - days + 1 < 0 ? 0 : i - days + 1;
    const window = data.slice(windowStart, i + 1);
    rollingVolArr.push(volatility(window));
  }

  return rollingVolArr;
}

export default rollingVol;
