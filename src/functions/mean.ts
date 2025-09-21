function mean(data: number[]) {
  const mean = data.reduce((sum, e) => sum + e, 0) / data.length;
  return mean;
}

export default mean;
