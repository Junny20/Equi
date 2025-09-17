import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import next from "next";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const symbols = url.searchParams.get("symbols");
  const symbolsArr = symbols?.split(",");
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
        "APCA-API-KEY-ID": API_KEY!,
        "APCA-API-SECRET-KEY": API_SECRET!,
      },
      params: {
        symbols: symbols,
        timeframe: timeframe,
        start: start,
        end: end,
        limit: limit,
        feed: feed,
      },
    });

    const data = response.data;

    var nextPageToken = response.data.next_page_token;

    while (nextPageToken) {
      const nextResponse = await axios.get(HISTORICAL_BARS_URL, {
        headers: {
          "APCA-API-KEY-ID": API_KEY!,
          "APCA-API-SECRET-KEY": API_SECRET!,
        },
        params: {
          symbols: symbols,
          timeframe: timeframe,
          start: start,
          end: end,
          limit: limit,
          feed: feed,
          page_token: nextPageToken,
        },
      });

      const nextData = nextResponse.data;

      if (nextData) {
        for (const symbol of Object.keys(nextData.bars)) {
          if (!data.bars[symbol]) {
            data.bars[symbol] = [];
          }
          data.bars[symbol].push(...nextData.bars[symbol]);
        }
      }

      nextPageToken = nextResponse.data.next_page_token;
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(`Failed to get stock data: ${err}`);
    return NextResponse.json({ error: "Failed to get stock data" });
  }
}
