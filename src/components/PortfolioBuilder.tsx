import type { ChangeEvent, FormEvent } from "react";

type Props = {
  placeholder: string;
  stock: string;
  setStock: (s: string) => void;
  shares: string;
  setShares: (s: string) => void;
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    stock: string,
    shares: string
  ) => void;
};

export default function PortfolioBuilder({
  placeholder,
  stock,
  setStock,
  shares,
  setShares,
  handleSubmit,
}: Props) {
  return (
    <form
      className="flex justify-between items-center border-2 border-gray-300 bg-white shadow-md rounded-xl p-1"
      onSubmit={(e) => {
        handleSubmit(e, stock, shares);
      }}
    >
      <section className="flex justify-center items-center">
        <label htmlFor="stock" className="font-medium text-gray-700 mx-2">
          <p>Stock: </p>
        </label>
        <input
          id="stock"
          className="border-2 border-gray-300 rounded-lg p-1 focus:outline-none focus:border-gray-500 w-[200px] transiton duration-500"
          type="text"
          value={stock}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setStock(e.target.value);
          }}
          placeholder={placeholder}
        />
      </section>

      <section className="flex justify-center items-center">
        <label htmlFor="shares" className="font-medium text-gray-700 mx-2">
          <p>Shares: </p>
        </label>
        <input
          id="shares"
          className="border-2 border-gray-300 rounded-lg p-1 focus:outline-none focus:border-gray-500 w-[200px] transiton duration-500"
          type="text"
          value={shares}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setShares(e.target.value);
          }}
          placeholder="Number of shares: "
        ></input>
      </section>

      <section className="mx-2">
        <button className="text-black hover:text-pink-500 rounded-lg bg-gray-300 p-2 transition duration-500">
          Submit
        </button>
      </section>
    </form>
  );
}
