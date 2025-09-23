import mean from "./mean";

function rollingMeanReturns(data: number[], days: number): number[] {
  let rollingMeanReturns: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < days - 1) {
      rollingMeanReturns.push(mean(data.slice(0, i + 1)));
      //rollingMeanReturns.push(0);
    } else {
      rollingMeanReturns.push(mean(data.slice(i - days + 1, i + 1)));
    }
  }

  return rollingMeanReturns;
}

export default rollingMeanReturns;
