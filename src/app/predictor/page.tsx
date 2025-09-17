"use client";

import predictModel from "@/models/predictModel";
import { FormEvent } from "react";
import { useState } from "react";
import LineChart from "@/graphs/LineChart";

import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";

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
  const [stock, setStock] = useState("");
  const [timeframe, setTimeframe] = useState<string>("5Min");
  const [timeperiod, setTimeperiod] = useState<string>("1D");
  const [bars, setBars] = useState<Bar[] | null>(null);
  const [preds, setPreds] = useState<number[] | null>(null);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    s: string,
    timeframe: string,
    timeperiod: string
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
        <SearchBar
          placeholder="Enter stock: "
          handleSubmit={handleSubmit}
          stock={stock}
          setStock={setStock}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          timeperiod={timeperiod}
          setTimeperiod={setTimeperiod}
        />
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
