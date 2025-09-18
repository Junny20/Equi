"use client";

import { useState, useEffect, FormEvent } from "react";
import NavBar from "@/components/NavBar";
import { div } from "@tensorflow/tfjs";

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
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);

    const getNews = async () => {
      try {
        const res = await fetch(
          `api/news?start=${start.toISOString()}&end=${end.toISOString()}`
        );
        const data = await res.json();

        try {
          const news = data.news
            .filter((e: News) => e.images.length === 3)
            .slice(0, 10);

          console.log(news);

          const headlines = news.map((e: News) => e.headline);
          setHeadlines(headlines);
          const urls = news.map((e: News) => e.url);
          setUrls(urls);
          const images: Image[][] = news.map((e: News) => e.images);

          let thumbs = [];

          let imSize = 0;
          for (const image of images) {
            const thumbUrl: string = image[imSize].url;
            thumbs.push(thumbUrl);
            if (imSize < 2) {
              imSize++;
            }
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
          <div className="px-6 md:px-8 lg:px-10 py-8">
            <div className="grid grid-cols-1 grid-rows-auto md:grid-cols-4 md:grid-rows-5 gap-1 md:gap-10 lg:gap-6">
              <div className="md:col-span-4 row-span-1 md:row-span-1 lg:row-span-2">
                <a href={urls[0]} target="_blank">
                  <img
                    src={thumbs[0]}
                    className="object-cover w-full md:h-72 lg:h-108"
                  />
                  <h1 className="text-2xl font-bold line-clamp-1">
                    {headlines[0]}
                  </h1>
                </a>
              </div>
              <div className="md:col-span-4 lg:col-span-2 md:row-span-1 lg:row-span-2 ">
                <a href={urls[1]} target="_blank">
                  <img
                    src={thumbs[1]}
                    className="object-cover w-full md:h-72 lg:h-108"
                  />
                  <h2 className="text-xl line-clamp-1">{headlines[1]}</h2>
                </a>
              </div>
              {urls.slice(2).map((e: string, i: number) => (
                <div className="md:col-span-2 lg:col-span-1">
                  <a key={i} href={e} target="_blank">
                    <img className="w-full" src={thumbs[2 + i]} />
                    <p className="text-sm text-gray-700 line-clamp-1">
                      {headlines[2 + i]}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
