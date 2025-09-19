import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const symbols = url.searchParams.get("symbols");

  const API_KEY = process.env.APCA_API_KEY;
  const API_SECRET = process.env.APCA_SECRET_KEY;
  const TRADES_URL = "https://data.alpaca.markets/v2/stocks/trades/latest";

  try {
    const response = await axios.get(TRADES_URL, {
      headers: {
        "APCA-API-KEY-ID": API_KEY!,
        "APCA-API-SECRET-KEY": API_SECRET!,
      },
      params: { symbols: symbols },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error("Failed to fetch stock trade price:", err);
    return NextResponse.json(
      { error: "Failed to fetch stock trade price" },
      { status: 500 }
    );
  }
}
