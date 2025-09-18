import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.APCA_API_KEY;
  const API_SECRET = process.env.APCA_SECRET_KEY;
  const ACCOUNT_URL = "https://paper-api.alpaca.markets/v2/account";

  try {
    const response = await axios.get(ACCOUNT_URL, {
      headers: {
        "APCA-API-KEY-ID": API_KEY!,
        "APCA-API-SECRET-KEY": API_SECRET!,
      },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error("Failed to get account data:", err);
    return NextResponse.json(
      { error: "Failed to get account data" },
      { status: 500 }
    );
  }
}
