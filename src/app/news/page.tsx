"use client";

import { useState, useEffect, FormEvent } from "react";
import NavBar from "@/components/NavBar";

export default function News() {
  const [news, setNews] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      const res = await fetch("api/news");
      const data = await res.json();

      setNews(JSON.stringify(data));
    } catch (err) {
      console.error("Error fetching news from frontend:", err);
    }
  };

  return (
    <>
      <section>
        <NavBar />
      </section>
      <section>
        <button className="border-4 border-orange-500" onClick={handleClick}>
          Get News
        </button>
        {news && <p>{news}</p>}
      </section>
    </>
  );
}
