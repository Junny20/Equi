import Link from "next/link";

export default function Test() {
  return (
    <>
      <div className="text-8xl">Test</div>
      <Link href="/">
        <button className="border-4 border-fuchsia-500">Go Back</button>
      </Link>
    </>
  );
}
