import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const symbols = url.searchParams.get("symbols");
  const timeframe = url.searchParams.get("timeframe");
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const limit = 10000;
  const feed = "iex";

  console.log(start, end);

  const API_KEY = process.env.APCA_API_KEY;
  const API_SECRET = process.env.APCA_SECRET_KEY;
  const HISTORICAL_BARS_URL = `https://data.alpaca.markets/v2/stocks/bars`;

  try {
    const response = await axios.get(HISTORICAL_BARS_URL, {
      headers: {
        "APCA-API-KEY-ID": API_KEY,
        "APCA-API-SECRET-KEY": API_SECRET,
      },
      params: {
        symbols: symbols,
        timeframe: timeframe,
        start: start,
        end: end,
        limit: limit,
        feed: "iex",
      },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to get stock data" });
  }
}
