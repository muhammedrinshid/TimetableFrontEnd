import React, { useState, useEffect } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";

// Function to generate mock data for the heatmap
const generateData = () => {
  const categories = ["Leaves", "ExtraLoad"];
  const data = categories.map(category => ({
    id: category,
    data: Array.from({ length: 365 }, (_, i) => ({
      x: `Day ${i + 1}`,
      y: Math.floor(Math.random() * 3) // Random value between 0-2
    }))
  }));
  return data;
};

const HeatmapWithTooltip = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateData()); // Generate the data once the component mounts
  }, []);

  return (
    <div style={{ height: "500px", width: "100%", padding: "20px" }}>
      <ResponsiveHeatMap
        data={data}
        keys={["y"]}
        indexBy="x"
        margin={{ top: 40, right: 30, bottom: 50, left: 50 }}
        forceSquare={true}
        padding={5}
        colors={{
          from: '#d4e157',
          to: '#ff7043'
        }}
        valueFormat={value => value.toFixed(0)}
        axisTop={{
          tickSize: 0,
          tickPadding: 15,
          tickRotation: 0,
          legend: "Days of the Year",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
          legend: "Types",
          legendOffset: -50,
        }}
        tooltip={({ cell }) => {
          const day = parseInt(cell.indexValue.split(" ")[1]);
          const details = {
            period: "1st",
            lesson: "Mathematics",
            teacher: "John Doe",
            reason: cell.serieId === "Leaves" ? "Sick" : "Additional Session",
          };

          return (
            <div
              style={{
                background: "white",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
              }}
            >
              <strong>Day: {day}</strong>
              <br />
              <strong>Type: {cell.serieId}</strong>
              <br />
              <strong>Details:</strong>
              <ul>
                <li>Period: {details.period}</li>
                <li>Lesson: {details.lesson}</li>
                <li>Teacher: {details.teacher}</li>
                <li>Reason: {details.reason}</li>
              </ul>
            </div>
          );
        }}
      />
    </div>
  );
};

export default HeatmapWithTooltip;