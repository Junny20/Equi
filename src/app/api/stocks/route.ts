import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const symbol = url.searchParams.get("symbol") || "AAPL";

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
        symbols: symbol,
        timeframe: "5Min",
        start: "2024-01-03",
        end: "2024-01-04",
      },
    });
    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to get stock data" });
  }
}
