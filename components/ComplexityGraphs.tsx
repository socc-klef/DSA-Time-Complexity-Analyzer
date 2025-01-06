import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export default function ComplexityGraph({ timeComplexity, spaceComplexity }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const newData = [];
    for (let n = 1; n <= 20; n++) {
      newData.push({
        n,
        time: calculateComplexity(n, timeComplexity),
        space: calculateComplexity(n, spaceComplexity),
      });
    }
    setData(newData);
  }, [timeComplexity, spaceComplexity]);

  const calculateComplexity = (n, complexity) => {
    switch (complexity.toLowerCase()) {
      case "o(1)":
        return 1;
      case "o(log n)":
        return Math.log2(n);
      case "o(n)":
        return n;
      case "o(n log n)":
        return n * Math.log2(n);
      case "o(n^2)":
        return Math.min(n * n, 1000);
      case "o(n^3)":
        return Math.min(n * n * n, 1000);
      case "o(2^n)":
        return Math.min(Math.pow(2, n), 1000);
      case "o(n!)":
        return Math.min(factorial(n), 1000);
      default:
        return 0;
    }
  };

  const factorial = (n) => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Algorithm Complexity</CardTitle>
        <CardDescription>
          Time and Space Complexity Visualization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-1">
          <p className="text-sm font-medium">Time: {timeComplexity}</p>
          <p className="text-sm font-medium">Space: {spaceComplexity}</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
              <XAxis
                dataKey="n"
                label={{
                  value: "Input Size (n)",
                  position: "insideBottom",
                  offset: -10, // Push the label down to avoid overlap
                }}
              />
              <YAxis
                label={{
                  value: "Operations",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10, // Adjust for a cleaner layout
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#8884d8"
                name="Time"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="space"
                stroke="#82ca9d"
                name="Space"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
