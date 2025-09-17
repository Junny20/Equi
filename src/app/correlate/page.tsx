"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import LineChart from "@/graphs/LineChart";
import MultipleStockLineChart from "@/graphs/MultipleStockLineChart";
import ScatterPlot from "@/graphs/ScatterPlot";

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
  const [stocksArray, setStocksArray] = useState<string[] | null>(null);
  const [bars, setBars] = useState<Bar[][] | null>(null);

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

    const stocks: string = s.replace(/\s/g, "");
    const stockArr: string[] = stocks.split(",");

    let stockBars: Bar[][] = [];

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

    console.log(stocks, timeframe, start, end);

    try {
      const res = await fetch(
        `api/stocks?symbols=${stocks}&timeframe=${timeframe}&start=${start.toISOString()}&end=${end.toISOString()}`
      );
      const data = await res.json();
      console.log(data);

      console.log(stockArr);

      for (const stock of stockArr) {
        const bars = data.bars[stock];
        stockBars.push(bars);
      }

      setBars(stockBars);
      setStocksArray(stockArr);
    } catch (err) {
      console.error(`Failed to fetch data of stocks ${stocks}: ${err}`);
    }
  };

  return (
    <>
      <section>
        <NavBar />
      </section>
      <section>
        <div>Finds the correlation between two stocks or more</div>
      </section>
      <section>
        <SearchBar
          placeholder="Enter stocks separated by a comma: e.g AAPL,TSLA"
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
          {bars?.length == 2 && stocksArray?.length == 2 && (
            <ScatterPlot
              bars={bars as [Bar[], Bar[]]}
              stocksArr={stocksArray}
            />
          )}
        </div>
        <div className="h-auto w-[70vw] mx-auto my-[2vw]">
          {bars && stocksArray && (
            <MultipleStockLineChart
              bars={bars}
              stocksArr={stocksArray}
              returns={true}
            />
          )}
        </div>
        <div className="h-auto w-[70vw] mx-auto my-[2vw]">
          {bars && stocksArray && (
            <MultipleStockLineChart bars={bars} stocksArr={stocksArray} />
          )}
        </div>
      </section>
    </>
  );
}
