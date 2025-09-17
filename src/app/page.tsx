"use client";

import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import CandlestickChart from "@/graphs/CandlestickChart";
import LineChart from "@/graphs/LineChart";
import DailyReturnsBarChart from "@/graphs/DailyReturnsBarChart";
import DailyReturnsHistogramChartStdev from "@/graphs/DailyReturnsHistogramChartStdev";
import DailyReturnsHistogramChartEven from "@/graphs/DailyReturnsHistogramChartEven";
import VolatilityLineChart from "@/graphs/VolatilityLineChart";
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

export default function Home() {
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

    try {
      const res = await fetch(
        `/api/stocks?symbols=${s}&timeframe=${timeframe}&start=${start.toISOString()}&end=${end.toISOString()}`
      );

      const data = await res.json();
      console.log(data);

      try {
        const bars = data["bars"][s];
        setBars(bars);
      } catch (err) {
        console.error("Could not build bars from data: ", err);
      }
    } catch (err) {
      console.error("Could not fetch response from initial API call:", err);
    }
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
      <section>
        <div className="h-auto w-[80vw] mx-auto my-[2vw]">
          {bars && <CandlestickChart bars={bars} />}
        </div>

        <div className="h-auto w-[70vw] mx-auto my-[2vw]">
          {bars && <LineChart bars={bars} />}
        </div>

        <div className="h-auto w-[70vw] mx-auto my-[2vw]">
          {bars && <VolatilityLineChart bars={bars} />}
        </div>

        <div className="h-auto w-[70vw] mx-auto my-[2vw]">
          {bars && <DailyReturnsBarChart bars={bars} />}
        </div>

        <div className="h-auto w-[70vw] mx-auto my-[2vw]">
          {bars && <DailyReturnsHistogramChartStdev bars={bars} />}
        </div>

        <div className="h-auto w-[70vw] mx-auto my-[2vw]">
          {bars && <DailyReturnsHistogramChartEven bars={bars} />}
        </div>
      </section>
    </>
  );
}
