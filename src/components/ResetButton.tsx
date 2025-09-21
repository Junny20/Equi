type Props = {
  setStock: (s: string) => void;
  setShares: (s: string) => void;
  setSharesArr: (n: number[]) => void;
  setStocksArr: (s: string[]) => void;
  setPricesArr: (n: number[]) => void;
  setShowReset: (b: boolean) => void;
  setShowDone: (b: boolean) => void;
};

export default function ResetButton({
  setStock,
  setShares,
  setSharesArr,
  setStocksArr,
  setPricesArr,
  setShowReset,
  setShowDone,
}: Props) {
  const handleClick = () => {
    console.log("Reset button clicked");
    setStock("");
    setShares("");
    setSharesArr([]);
    setStocksArr([]);
    setPricesArr([]);
    setShowReset(false);
    setShowDone(false);
  };
  return <button onClick={handleClick}>Reset</button>;
}
