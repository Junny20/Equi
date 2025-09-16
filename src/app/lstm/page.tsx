"use client";

import lstmmodel from "@/models/lstmmodel";
import Link from "next/link";
import { FormEvent } from "react";
import { useState } from "react";
import LineChart from "@/components/LineChart";

import type { ChangeEvent } from "react";

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
  const [stock, setStock] = useState<string>("");
  const [bars, setBars] = useState<Bar[] | null>(null);
  const [preds, setPreds] = useState<number[] | null>(null);
  const [actualPrices, setActualPrices] = useState<number[] | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, s: string) => {
    e.preventDefault();

    if (!s) {
      return;
    }

    const res = await fetch(
      `/api/stocks?symbols=${s}&timeframe=1D&start=2024-09-10&end=2025-09-15`
    );

    try {
      const data = await res.json();

      const bars = data["bars"][s];

      bars && setBars(bars);

      const closingPrices = bars.map((e: Bar) => e.c);

      const [predictions, len] = await lstmmodel(closingPrices, 10);

      if (predictions) {
        const lineData = [...new Array(len).fill(null), ...predictions];

        setPreds(lineData);
      }

      if (len) {
        setActualPrices(closingPrices.slice(len));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <p>Helo</p>
      <form
        action="post"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          handleSubmit(e, stock);
        }}
      >
        <input
          type="text"
          placeholder="Enter stock: "
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setStock(e.target.value);
          }}
          value={stock}
        />
        <button>Submit</button>
      </form>

      <div className="h-auto w-[70vw] mx-auto my-[2vw]">
        {bars && <LineChart bars={bars} />}
      </div>

      {preds && <p>{JSON.stringify(preds)}</p>}
      <div className="h-auto w-[70vw] mx-auto my-[2vw]">
        {bars && preds && (
          <LineChart bars={bars} showRollingAvg={false} predicted={preds} />
        )}
      </div>

      <Link href={"/"}>Go Back</Link>
    </>
  );
}
