import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./WeeklyChart.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import Colors from "../../constants/colors";

export const WeeklyChart = (WeekData) => {
  return (
    <div
      className="section-outer-wrapper col-md-8 mx-auto mb-5 mt-5"
      style={{ backgroundColor: Colors.graphBG }}
    >
      <h3 className="section-title text-white text-center">
        Weekly Spend Analysis
      </h3>
      <div className="section-inner-wrapper">
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart
            data={WeekData.data}
            margin={{ top: 5, right: 0, bottom: 25, left: 10 }}
          >
            <Tooltip />
            <XAxis
              dataKey="time"
              dy={5}
              tick={{ fill: Colors.white }}
              label={{
                value: "Week Year",
                position: "center",
                dy: 28,
                fill: Colors.white,
              }}
            />
            <YAxis
              tickFormatter={(tick) => {
                return `\u20B9${tick}`;
              }}
              tick={{ fill: Colors.white }}
            />
            <CartesianGrid
              stroke={Colors.cartesianStroke}
              strokeDasharray="0 0"
              fill={Colors.graphBG}
            />
            <Legend layout="horizontal" verticalAlign="top" align="center" />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={Colors.blue}
              strokeWidth={2}
              name="Weekly Spend"
            />
            <Line
              type="monotone"
              dataKey="roll_avg"
              stroke={Colors.orange}
              strokeWidth={2}
              name="Roll Avg(5)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
