"use client";

import NavBar from "@/components/NavBar";
import PortfolioBuilder from "@/components/PortfolioBuilder";
import ResetButton from "@/components/ResetButton";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import Heatmap from "@/graphs/HeatmapChart";
import PortfolioValueChart from "@/graphs/PortfolioValueChart";

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

export default function Portfolio() {
  const [show, setShow] = useState<boolean>(false);
  const [showReset, setShowReset] = useState<boolean>(false);
  const [showDone, setShowDone] = useState<boolean>(false);

  const [stock, setStock] = useState<string>("");
  const [shares, setShares] = useState<string>("");
  const [position, setPosition] = useState<string>("Long");
  const [sharesArr, setSharesArr] = useState<number[]>([]);
  const [totalShares, setTotalShares] = useState<number>(0);
  const [stocksArr, setStocksArr] = useState<string[]>([]);
  const [pricesArr, setPricesArr] = useState<number[]>([]);
  const [positionsArr, setPositionsArr] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [errMessage, setErrMessage] = useState<string | null>(null);

  const [bars, setBars] = useState<Bar[][] | null>(null);

  const getBars = async (stocksArr: string[]) => {
    console.log(stocksArr);

    const stocks = stocksArr.join(",");
    const defaultTimeframe = "1D";
    const defaultEnd = new Date();
    const defaultStart = new Date();
    defaultStart.setFullYear(defaultEnd.getFullYear() - 1);

    let stockBars: Bar[][] = [];

    try {
      const res = await fetch(
        `api/stocks?symbols=${stocks}&timeframe=${defaultTimeframe}&start=${defaultStart.toISOString()}&end=${defaultEnd.toISOString()}`
      );
      const data = await res.json();

      console.log(data);

      for (const stock of stocksArr) {
        const bars = data.bars[stock];
        stockBars.push(bars);
      }

      console.log(stockBars);

      setBars(stockBars);
    } catch (err) {
      console.error();
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    stock: string,
    shares: string,
    position: string
  ) => {
    e.preventDefault();
    console.log(stock, shares, position);

    const formattedStocks = stock.replace(/\s/g, "").toUpperCase();
    const formattedShares = shares.replace(/\s/g, "");

    try {
      const res = await fetch(`/api/stocks/trades?symbols=${formattedStocks}`);
      const data = await res.json();

      if (data.trades) {
        const stocksArray = formattedStocks.split(",");
        const sharesArr = formattedShares
          .split(",")
          .map((e: string) => Number(e));

        if (sharesArr.length === 1) {
          sharesArr.push(...Array(stocksArray.length - 1).fill(sharesArr[0]));
        }

        const positionsArr: string[] = new Array(stocksArray.length).fill(
          position
        );

        if (Object.keys(data.trades).length === 0) {
          console.error(
            "No trade data available for selected stock/s. Check if symbols are indeed spelled correctly."
          );
          setErrMessage(
            "No trade data available for selected stock/s. Check if symbols are indeed spelled correctly."
          );
          if (show) {
            setShow((prevValue) => !prevValue);
          }
          setStock("");
          setShares("");
          if (showReset) {
            setShowReset((prevValue) => !prevValue);
          }
          return;
        } else if (Object.keys(data.trades).length !== stocksArray.length) {
          console.error(
            "Mismatch between trading data length and selected stocks length. Check if all symbols are indeed spelled correctly."
          );
          setErrMessage(
            "Mismatch between trading data length and selected stocks length. Check if all symbols are indeed spelled correctly."
          );
          if (show) {
            setShow((prevValue) => !prevValue);
          }
          setStock("");
          setShares("");
          if (showReset) {
            setShowReset((prevValue) => !prevValue);
          }
          return;
        } else if (
          sharesArr.length !== 1 &&
          sharesArr.length !== stocksArray.length
        ) {
          console.error(
            "Invalid format in shares input. One number or a list of comma separated numbers must be entered."
          );
          setErrMessage(
            "Invalid format in shares input. One number or a list of comma separated numbers must be entered."
          );
          if (show) {
            setShow((prevValue) => !prevValue);
          }
          setStock("");
          setShares("");
          return;
        }

        setStocksArr((prevValue) => [...prevValue, ...stocksArray]);
        setSharesArr((prevValue) => [...prevValue, ...sharesArr]);
        setPositionsArr((prevValue) => [...prevValue, ...positionsArr]);

        let prices = [];

        for (const stock of stocksArray) {
          const price = data.trades[stock]["p"];
          prices.push(price);
        }

        setPricesArr((prevValue) => [...prevValue, ...prices]);

        if (!show) {
          setShow((prevValue) => !prevValue);
        }
        setStock("");
        setShares("");
        if (!showReset) {
          setShowReset((prevValue) => !prevValue);
        }
        if (!showDone) {
          setShowDone((prevValue) => !prevValue);
        }
        if (errMessage) {
          setErrMessage(null);
        }
      } else {
        console.error(
          "Invalid stock search. Check if symbols are comma separated and spelled correctly."
        );
        setErrMessage(
          "Invalid stock search. Check if symbols are comma separated and spelled correctly."
        );
        if (show) {
          setShow((prevValue) => !prevValue);
        }
        setStock("");
        setShares("");
        if (showReset) {
          setShowReset((prevValue) => !prevValue);
        }
        return;
      }
    } catch (err) {
      console.error("Failed to fetch trade data from frontend:", err);
      setErrMessage(`Failed to fetch trade data from frontend: ${err}`);
      return;
    }
  };

  useEffect(() => {
    let totalPrice = 0;
    let totalShares = 0;

    pricesArr.forEach((e: number, i: number) => {
      totalPrice += e * sharesArr[i];
    });
    totalShares = sharesArr.reduce((sum, e) => sum + e, 0);

    setTotalPrice(Number(totalPrice.toFixed(2)));
    setTotalShares(Number(totalShares.toFixed(2)));
  }, [pricesArr]);

  return (
    <>
      <section>
        <NavBar />
      </section>

      <main className="lg:m-10 md:m-9 m-8">
        <section className="mx:1 my-6">
          <p className="text-lg">
            <strong>EquiPortfolio</strong> - Build a porfolio and see
            profitability.
          </p>
        </section>

        <section className="mb-4">
          <PortfolioBuilder
            placeholder="Add stock/s to portfolio:"
            stock={stock}
            setStock={setStock}
            shares={shares}
            setShares={setShares}
            position={position}
            setPosition={setPosition}
            handleSubmit={handleSubmit}
          />
        </section>

        <section className="mt-4">{errMessage && <p>{errMessage}</p>}</section>

        <section>
          {stocksArr &&
            pricesArr &&
            stocksArr.length === pricesArr.length &&
            show && (
              <table className="table-auto w-[100%] text-left">
                <thead>
                  <tr>
                    <th className="border border-gray-400 p-1">Symbol</th>
                    <th className="border border-gray-400 p-1">
                      Latest price traded
                    </th>
                    <th className="border border-gray-400 p-1">Position</th>
                    <th className="border border-gray-400 p-1">Shares</th>
                    <th className="border border-gray-400 p-1">
                      Total price of shares
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stocksArr.map((e: string, i: number) => (
                    <tr key={i}>
                      <td className="border border-gray-400 p-1">{e}</td>
                      <td className="border border-gray-400 p-1">
                        {pricesArr[i]}
                      </td>
                      <td className="border border-gray-400 p-1">
                        {positionsArr[i]}
                      </td>
                      <td className="border border-gray-400 p-1">
                        {sharesArr[i]}
                      </td>
                      <td className="border border-gray-400 p-1">
                        {Number(sharesArr[i] * pricesArr[i]).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="font-bold border border-gray-400 p-1">
                      Total:{" "}
                    </td>
                    <td className="border border-gray-400 p-1">
                      {totalShares}
                    </td>
                    <td className="border border-gray-400 p-1">{totalPrice}</td>
                  </tr>
                </tbody>
              </table>
            )}
        </section>

        <section>
          {showDone && (
            <div className="bg-gray-700 text-white inline-block rounded-lg px-2 py-1 mt-4">
              <button
                onClick={() => {
                  getBars(stocksArr);
                }}
              >
                Done
              </button>
            </div>
          )}
          {showReset && (
            <div className="bg-gray-700 text-white inline-block rounded-lg px-2 py-1 mt-4">
              <ResetButton
                setStock={setStock}
                setShares={setShares}
                setSharesArr={setSharesArr}
                setStocksArr={setStocksArr}
                setPricesArr={setPricesArr}
                setShowReset={setShowReset}
                setShowDone={setShowDone}
              />
            </div>
          )}
        </section>
      </main>

      <section>
        <div className="h-[60vh] w-[70vw] mx-auto my-[2vw]">
          {bars &&
            stocksArr &&
            sharesArr &&
            bars.length === stocksArr.length &&
            sharesArr && (
              <PortfolioValueChart
                bars={bars}
                stocksArr={stocksArr}
                sharesArr={sharesArr}
              />
            )}
        </div>

        <div className="h-[60vh] w-[70vw] mx-auto my-[2vw]">
          {bars && stocksArr && bars.length === stocksArr.length && (
            <Heatmap bars={bars} stocksArr={stocksArr} />
          )}
        </div>
      </section>
    </>
  );
}
