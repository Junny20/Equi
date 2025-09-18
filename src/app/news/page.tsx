"use client";

import { useState, useEffect, FormEvent } from "react";
import NavBar from "@/components/NavBar";

type Image = {
  size: string;
  url: string;
};

type News = {
  author: string;
  content: string;
  created_at: string;
  headline: string;
  id: number;
  images: Image[];
  source: string;
  summary: string;
  symbols: string[];
  updated_at: string;
  url: string;
};

export default function News() {
  const [urls, setUrls] = useState<string[] | null>(null);
  const [headlines, setHeadlines] = useState<string[] | null>(null);
  const [thumbs, setThumbs] = useState<string[] | null>(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        const res = await fetch("api/news");
        const data = await res.json();

        try {
          const news = data.news;
          const headlines = news.map((e: News) => e.headline);
          setHeadlines(headlines);
          const urls = news.map((e: News) => e.url);
          setUrls(urls);
          const images: Image[][] = news.map((e: News) => e.images);

          let thumbs = [];
          for (const image of images) {
            const thumbUrl: string = image[2].url;
            thumbs.push(thumbUrl);
          }

          setThumbs(thumbs);
        } catch (err) {
          console.error("Failed to fetch news from data:", err);
        }
      } catch (err) {
        console.error("Error fetching news from frontend:", err);
      }
    };

    getNews();
  }, []);

  return (
    <>
      <section>
        <NavBar />
      </section>
      <section>
        {urls && thumbs && headlines && (
          <ul>
            {urls.map((e, i: number) => (
              <a className="block mx-4 my-4" key={i} href={e} target="_blank">
                <img src={thumbs[i]}></img>
                <p>{headlines[i]}</p>
              </a>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
