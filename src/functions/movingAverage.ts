function rollingAvg(data: number[], days: number): number[] {
  let rollingAvgArr: number[] = [];
  const dataLength = data.length;
  var end = 1;
  while (end <= dataLength) {
    if (end - days < 0) {
      const sum = data.slice(0, end).reduce((sum, e) => sum + e, 0);
      const len = data.slice(0, end).length;
      const mean = sum / len;
      rollingAvgArr.push(mean);
    } else {
      const sum = data.slice(end - days, end).reduce((sum, e) => sum + e, 0);
      const mean = sum / days;
      rollingAvgArr.push(mean);
    }
    end++;
  }
  return rollingAvgArr;
}

export default rollingAvg;
