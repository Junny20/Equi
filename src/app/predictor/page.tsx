"use client";

import predictModel from "@/models/predictModel";
import { FormEvent } from "react";
import { useState } from "react";
import LineChart from "@/graphs/LineChart";

import type { ChangeEvent } from "react";
import NavBar from "@/components/NavBar";

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
  const [timeframe, setTimeframe] = useState<string>("5M");
  const [timeperiod, setTimeperiod] = useState<string>("1D");
  const [preds, setPreds] = useState<number[] | null>(null);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    s: string,
    tf: string,
    tp: string
  ) => {
    e.preventDefault();

    if (!s) {
      return;
    }

    const end = new Date();
    var start = new Date();

    if (timeperiod === "YTD") {
      start.setMonth(0);
      start.setDate(1);
    } else if (timeperiod[timeperiod.length - 1] === "D") {
      start.setDate(end.getDate() - parseInt(timeperiod[0])); //WILL BREAK AND GO INTO THE NEGATIVES
    } else if (timeperiod[timeperiod.length - 1] === "M") {
      start.setMonth(end.getMonth() - parseInt(timeperiod[0]));
    } else if (timeperiod[timeperiod.length - 1] === "Y") {
      start.setFullYear(end.getFullYear() - parseInt(timeperiod[0]));
    } else {
      start = new Date("2016-01-01");
    }

    console.log(timeframe, start, end);

    try {
      const res = await fetch(
        `/api/stocks?symbols=${s}&timeframe=${timeframe}&start=${start.toISOString()}&end=${end.toISOString()}`
      );
      const data = await res.json();

      const bars = data["bars"][s];

      bars && setBars(bars);

      const closingPrices = bars.map((e: Bar) => e.c);

      const predictions = await predictModel(closingPrices, 10, 50);

      if (predictions) {
        const lineData = predictions;

        setPreds(lineData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <section>
        <NavBar />
      </section>
      <section>
        <form
          className="border-4 border-pink-500"
          action="post"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            handleSubmit(e, stock, timeframe, timeperiod);
          }}
        >
          <input
            type="text"
            value={stock}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setStock(e.target.value);
            }}
            placeholder="Enter stock: "
          />

          <label htmlFor="timeframe">Time interval: </label>
          <select
            name="timeframe"
            id="timeframe"
            className="border p-2 rounded"
            onChange={(e) => {
              setTimeframe(e.target.value);
            }}
          >
            {/* <option value="1Min">1 Minute</option> */}
            <option value="5Min">5 Minutes</option>
            <option value="15Min">15 Minutes</option>
            <option value="30Min">30 Minutes</option>
            <option value="1Hour">1 Hour</option>
            <option value="1Day">1 Day</option>
            <option value="1Week">1 Week</option>
            <option value="1Month">1 Month</option>
          </select>

          <label htmlFor="timeperiod">Time period: </label>
          <select
            name="timeperiod"
            id="timeperiod"
            className="border p-2 rounded"
            onChange={(e) => {
              setTimeperiod(e.target.value);
            }}
          >
            <option value="1D">1 Day</option>
            <option value="5D">5 Days</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="YTD">YTD</option>
            <option value="1Y">1 Year</option>
            <option value="5Y">5 Years</option>
            <option value="MAX">Max</option>
          </select>
          <button>Submit</button>
        </form>
      </section>

      <section>
        <div className="h-auto w-[70vw] mx-auto my-[2vw]">
          {bars && <LineChart bars={bars} />}
        </div>

        <div className="h-auto w-[70vw] mx-auto my-[2vw]">
          {bars && preds && (
            <LineChart
              bars={bars}
              showRollingAvg={false}
              predicted={preds}
              timeframe={timeframe}
              futureDataPoints={50}
            />
          )}
        </div>
      </section>
    </>
  );
}
