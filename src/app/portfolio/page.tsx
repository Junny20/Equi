"use client";

import NavBar from "@/components/NavBar";
import PortfolioBuilder from "@/components/PortfolioBuilder";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

export default function Portfolio() {
  const [show, setShow] = useState<boolean>(false);
  const [stock, setStock] = useState<string>("");
  const [shares, setShares] = useState<string>("");
  const [totalShares, setTotalShares] = useState<number>(0);
  const [stocksArr, setStocksArr] = useState<string[]>([]);
  const [pricesArr, setPricesArr] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    stock: string,
    shares: string
  ) => {
    e.preventDefault();
    console.log(stock, shares);

    const formattedStocks = stock.replace(/\s/g, "");
    console.log(formattedStocks);

    try {
      const res = await fetch(`/api/stocks/trades?symbols=${formattedStocks}`);
      const data = await res.json();

      if (data.trades) {
        const stocksArr = Object.keys(data.trades);

        setStocksArr((prevValue) => [...prevValue, ...stocksArr]);

        let prices = [];

        for (const stock of stocksArr) {
          const price = data.trades[stock]["p"];
          prices.push(price);
        }

        setPricesArr((prevValue) => [...prevValue, ...prices]);

        if (!show) {
          setShow((prevValue) => !prevValue);
        }
      } else {
        console.error("No trade data available.");
        return;
      }
    } catch (err) {
      console.error("Failed to fetch trade data from frontend:", err);
      return;
    }
  };

  useEffect(() => {
    const totalPrice =
      pricesArr.reduce((sum, e) => sum + e, 0) * parseFloat(shares);
    setTotalPrice(Number(totalPrice.toFixed(2)));
    setTotalShares(Number((pricesArr.length * parseFloat(shares)).toFixed(2)));
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

        <section>
          <PortfolioBuilder
            placeholder="Add stock to portfolio:"
            stock={stock}
            setStock={setStock}
            shares={shares}
            setShares={setShares}
            handleSubmit={handleSubmit}
          />
        </section>
      </main>

      <section>
        {stocksArr &&
          pricesArr &&
          stocksArr.length === pricesArr.length &&
          show && (
            <table className="table-auto w-[92vw] mx-auto text-left">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-1">Symbol</th>
                  <th className="border border-gray-400 p-1">
                    Latest price traded
                  </th>
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
                    <td className="border border-gray-400 p-1">{shares}</td>
                    <td className="border border-gray-400 p-1">
                      {(parseFloat(shares) * pricesArr[i]).toFixed(1)}
                    </td>
                    {/* fix parseInt ugly ass code */}
                  </tr>
                ))}
                <tr>
                  <td></td>

                  <td className="font-bold border border-gray-400 p-1">
                    Total:{" "}
                  </td>
                  <td className="border border-gray-400 p-1">{totalShares}</td>
                  <td className="border border-gray-400 p-1">{totalPrice}</td>
                </tr>
              </tbody>
            </table>
          )}
      </section>
    </>
  );
}
