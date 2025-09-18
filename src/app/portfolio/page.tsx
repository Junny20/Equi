"use client";

import NavBar from "@/components/NavBar";
import PortfolioBuilder from "@/components/PortfolioBuilder";
import { useState } from "react";
import type { FormEvent } from "react";

export default function Portfolio() {
  const [stock, setStock] = useState<string>("");
  const [shares, setShares] = useState<string>("");
  const [stocksArr, setStocksArr] = useState<string[] | null>(null);
  const [pricesArr, setPricesArr] = useState<number[] | null>(null);

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
      const res = await fetch(`api/stocks/quotes?symbols=${formattedStocks}`);
      const data = await res.json();

      console.log(data);

      if (data.quotes) {
        const stocksArr = Object.keys(data.quotes);
        setStocksArr(stocksArr);
        let askingPrices = [];

        for (const stocks of stocksArr) {
          const askingPrice = data.quotes[stocks]["ap"];
          askingPrices.push(askingPrice);
        }

        setPricesArr(askingPrices);
      } else {
        console.error("No quote data available.");
        return;
      }
    } catch (err) {
      console.error("Failed to fetch quote data from frontend:", err);
      return;
    }
  };

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
    </>
  );
}
