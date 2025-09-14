"use client";

import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";
import CandlestickChart from "@/components/CandlestickChart";
import LineChart from "@/components/LineChart";

type Bar = {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: string;
  v: number;
  vw: number;
};

export default function Home() {
  const [stock, setStock] = useState("");
  const [bars, setBars] = useState<Bar[] | null>(null);
  const [tradingTimes, setTradingTimes] = useState<null | string[]>(null);
  const [tradingHigh, setTradingHigh] = useState<null | number[]>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, s: string) => {
    e.preventDefault();
    console.log("Submit clicked");
    const res = await fetch(`/api/stocks?symbol=${s}`);
    const data = await res.json();
    console.log(JSON.stringify(data));

    const bars = data["bars"][s];

    setBars(bars);

    // const stockTradingTimes = bars.map((e: Bar) => e["t"]);
    // const stockTradingHighs = bars.map((e: Bar) => e["h"]);

    // setTradingTimes(stockTradingTimes);
    // setTradingHigh(stockTradingHighs);
  };

  return (
    <>
      <div>Hello</div>
      <form
        action="post"
        onSubmit={(e) => {
          handleSubmit(e, stock);
        }}
      >
        <input
          type="text"
          value={stock}
          onChange={handleChange}
          placeholder="Enter stock: "
        />
        <button>Submit</button>
        {bars && <CandlestickChart bars={bars} />}
        {bars && <LineChart bars={bars} />}
      </form>
    </>
  );
}
