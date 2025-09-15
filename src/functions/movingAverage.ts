function movingAverage(data: number[], days: number): number[] {
  let ma: number[] = [];
  const dataLength = data.length;
  var end = 1;
  while (end <= dataLength) {
    if (end - days < 0) {
      const sum = data.slice(0, end).reduce((e, v) => e + v, 0);
      const len = data.slice(0, end).length;
      const mean = sum / len;
      ma.push(mean);
    } else {
      const sum = data.slice(end - days, end).reduce((e, v) => e + v, 0);
      const mean = sum / days;
      ma.push(mean);
    }
    end++;
  }
  return ma;
}

export default movingAverage;
