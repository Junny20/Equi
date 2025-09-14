import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

export default function LineChart({ bars }) {
  const lineData = {
    labels: bars.map((e) => e.t),
    datasets: [
      {
        label: "Price points",
        data: bars.map((e) => {
          return e.c;
        }),
      },
    ],
  };

  return <Line data={lineData} />;
}
