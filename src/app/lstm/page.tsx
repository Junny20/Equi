"use client";

import lstmmodel from "@/models/lstmmodel";
import Link from "next/link";
import { FormEvent } from "react";
import { useState } from "react";

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

export default function Model() {
  const [preds, setPreds] = useState<number[] | null>(null);
  const [actualPrices, setActualPrices] = useState<number[] | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(
      `/api/stocks?symbols=AAPL&timeframe=5Min&start=2025-09-05&end=2025-09-15`
    );

    const data = await res.json();

    const bars = data["bars"]["AAPL"];

    const closingPrices = bars.map((e: Bar) => e.c);

    const [predictions, len] = await lstmmodel(closingPrices, 10);

    if (predictions) {
      setPreds(predictions);
    }

    if (len) {
      setActualPrices(closingPrices.slice(len));
    }
  };

  return (
    <>
      <p>Helo</p>
      <form
        action="post"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input type="text" placeholder="Enter stock: " />
        <button>Submit</button>
      </form>
      {preds && <p>{JSON.stringify(preds)}</p>}
      {actualPrices && <p>{JSON.stringify(actualPrices)}</p>}
      <Link href={"/"}>Go Back</Link>
    </>
  );
}
