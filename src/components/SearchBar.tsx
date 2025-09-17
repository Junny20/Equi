import type { ChangeEvent, FormEvent } from "react";

type Props = {
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
      className="border-4 border-pink-500"
      action="post"
      onSubmit={(e) => {
        handleSubmit(e, stock, timeframe, timeperiod);
      }}
    >
      <input
        type="text"
        value={stock}
        onChange={handleChange}
        placeholder="Enter stock: "
      />

      <label htmlFor="timeframe">Time interval: </label>
      <select
        name="timeframe"
        id="timeframe"
        className="border p-2 rounded"
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

      <label htmlFor="timeperiod">Time period: </label>
      <select
        name="timeperiod"
        id="timeperiod"
        className="border p-2 rounded"
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
      <button>Submit</button>
    </form>
  );
}
