import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export interface AlpacaNewsImage {
  size: string;
  url: string;
}

export interface AlpacaNewsItem {
  id: string;
  author: string;
  created_at: string;
  headline: string;
  summary: string;
  url: string;
  images: AlpacaNewsImage[];
  symbols: string[];
  source: string;
}

export interface AlpacaNewsResponse {
  news: AlpacaNewsItem[];
  next_page_token: string | null;
}

export async function GET(req: NextRequest) {
  const API_KEY = process.env.APCA_API_KEY;
  const API_SECRET = process.env.APCA_SECRET_KEY;
  const NEWS_URL = "https://data.alpaca.markets/v1beta1/news";

  if (req) {
    const url = req.nextUrl;
    const symbols = url.searchParams.get("symbols");
    try {
      const response = await axios.get(NEWS_URL, {
        headers: {
          "APCA-API-KEY-ID": API_KEY!,
          "APCA-API-SECRET-KEY": API_SECRET!,
        },
        params: {
          symbols: symbols,
          exclude_contentless: "true",
        },
      });

      return NextResponse.json(response.data); // response.data is json obj, .json converts to response obj
    } catch (err) {
      console.error(`Failed to fetch news, ${err}`);
      return NextResponse.json(
        { error: "Failed to fetch news" },
        { status: 500 }
      );
    }
  } else {
    try {
      const response = await axios.get<AlpacaNewsResponse>(NEWS_URL, {
        headers: {
          "APCA-API-KEY-ID": API_KEY!,
          "APCA-API-SECRET-KEY": API_SECRET!,
        },
      });

      return NextResponse.json(response.data);
    } catch (err) {
      console.error(`Failed to fetch news, ${err}`);
      return NextResponse.json(
        { error: "Failed to fetch news" },
        { status: 500 }
      );
    }
  }
}
