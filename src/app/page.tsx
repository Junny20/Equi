"use client";

import { headers } from "next/headers";
import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [stock, setStock] = useState("");
  const [intradayData, setIntradayData] = useState(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, s: string) => {
    e.preventDefault();
    console.log("Submit clicked");
    const res = await fetch(`/api/stocks?symbol=${s}`);
    const data = await res.json();
    setIntradayData(data["Time Series (5min)"]);
  };

  return (
    <>
      <div>Hello</div>
      <form
        action="post"
        onSubmit={(e) => {
          handleSubmit(e, stock);
        }}
      >
        <input
          type="text"
          value={stock}
          onChange={handleChange}
          placeholder="Enter stock: "
        />
        <button>Submit</button>
      </form>
      {intradayData && <p>{JSON.stringify(intradayData)}</p>}
      <Link href="/test">
        <button className="border-4 border-fuchsia-500">Go to test</button>
      </Link>
    </>
  );
}
