function getFutureDates(
  lastDate: Date,
  timeframe: string,
  interval: number,
  futureDataPoints: number
) {
  let futureDates = [lastDate];
  for (var i = 0; i < futureDataPoints; i++) {
    const lastDate = futureDates[futureDates.length - 1];
    const futureDate = new Date(lastDate);

    if (timeframe === "minutes") {
      futureDate.setMinutes(futureDate.getMinutes() + interval);
    } else if (timeframe === "hours") {
      futureDate.setHours(futureDate.getHours() + interval);
    } else if (timeframe === "days") {
      futureDate.setDate(futureDate.getDate() + interval);
    } else if (timeframe === "weeks") {
      futureDate.setDate(futureDate.getDate() + 7 * interval);
    } else if (timeframe === "months") {
      futureDate.setMonth(futureDate.getMonth() + interval);
    } else {
      console.error("Invalid timeframe format!");
      continue;
    }

    futureDates.push(futureDate);
  }
  return futureDates;
}

export default getFutureDates;
