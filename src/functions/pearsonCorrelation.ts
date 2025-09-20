function pearsonCorrelation(x: number[], y: number[]): number {
  let length: number;
  if (x.length !== y.length) {
    length = Math.min(x.length, y.length);
  } else {
    length = x.length;
  }

  const meanX = x.reduce((sum, e) => sum + e, 0) / length;
  const meanY = y.reduce((sum, e) => sum + e, 0) / length;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < length; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const pearsonCorr = numerator / Math.sqrt(denomX * denomY);
  return pearsonCorr;
}

export default pearsonCorrelation;
