import type { ChangeEvent, FormEvent } from "react";

type Props = {
  placeholder: string;
  stock: string;
  setStock: (s: string) => void;
  timeframe: string;
  setTimeframe: (t: string) => void;
  timeperiod: string;
  setTimeperiod: (t: string) => void;
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    stock: string,
    timeframe: string,
    timeperiod: string
  ) => void;
};

export default function SearchBar({
  placeholder,
  stock,
  setStock,
  timeframe,
  setTimeframe,
  timeperiod,
  setTimeperiod,
  handleSubmit,
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value);
  };

  return (
    <form
      className="flex justify-between items-center border-2 border-gray-300 bg-white shadow-md rounded-xl p-1"
      action="post"
      onSubmit={(e) => {
        handleSubmit(e, stock, timeframe, timeperiod);
      }}
    >
      <section className="flex justify-center items-center">
        <label htmlFor="stock" className="font-medium text-gray-700 mx-2">
          <p>Stock: </p>
        </label>
        <input
          id="stock"
          className="border-2 border-gray-300 rounded-lg p-1 focus:outline-none focus:border-gray-500 max-w-[300px] transiton duration-500"
          type="text"
          value={stock}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </section>

      <section className="mx-2">
        <label className="font-medium text-gray-700" htmlFor="timeframe">
          Time interval:{" "}
        </label>
        <select
          name="timeframe"
          id="timeframe"
          className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-500 transiton duration-500"
          onChange={(e) => {
            setTimeframe(e.target.value);
          }}
        >
          {/* <option value="1Min">1 Minute</option> */}
          <option value="5Min">5 Minutes</option>
          <option value="15Min">15 Minutes</option>
          <option value="30Min">30 Minutes</option>
          <option value="1Hour">1 Hour</option>
          <option value="1Day">1 Day</option>
          <option value="1Week">1 Week</option>
          <option value="1Month">1 Month</option>
        </select>
      </section>

      <section className="mx-2">
        <label className="font-medium text-gray-700" htmlFor="timeperiod">
          Time period:{" "}
        </label>
        <select
          name="timeperiod"
          id="timeperiod"
          className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-500 transiton duration-500"
          onChange={(e) => {
            setTimeperiod(e.target.value);
          }}
        >
          <option value="1D">1 Day</option>
          <option value="5D">5 Days</option>
          <option value="1M">1 Month</option>
          <option value="3M">3 Months</option>
          <option value="6M">6 Months</option>
          <option value="YTD">YTD</option>
          <option value="1Y">1 Year</option>
          <option value="5Y">5 Years</option>
          <option value="MAX">Max</option>
        </select>
      </section>

      <section className="mx-2">
        <button className="text-black hover:text-pink-500 rounded-lg bg-gray-300 p-2 transition duration-500">
          Submit
        </button>
      </section>
    </form>
  );
}
