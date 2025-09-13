import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const symbol: string = searchParams.get("symbol") || "IBM"; //default stock is IBM

  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
  const API_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;

  try {
    const response = await axios.get(API_URL);
    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to get stock data" });
  }
}
