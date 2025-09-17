"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
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

export default function Correlate() {
  const [stock, setStock] = useState("");
  const [timeframe, setTimeframe] = useState<string>("5Min");
  const [timeperiod, setTimeperiod] = useState<string>("1D");
  const [bars, setBars] = useState<Bar[] | null>(null);

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
  };

  return (
    <>
      <section>
        <NavBar />
      </section>
      <section>
        <SearchBar
          handleSubmit={handleSubmit}
          stock={stock}
          setStock={setStock}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          timeperiod={timeperiod}
          setTimeperiod={setTimeperiod}
        />
      </section>
      <div>Finds the correlation between two stocks</div>
    </>
  );
}
