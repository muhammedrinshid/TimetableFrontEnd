import React from "react";

const data = [
  {
    id: "Leaves",
    data: [
      { x: "Jan", y: 3 },
      { x: "Feb", y: 3 },
      { x: "Mar", y: 3 },
      { x: "Apr", y: 3 },
      { x: "May", y: 3 },
      { x: "Jun", y: 3 },
      { x: "Jul", y: 6 },
      { x: "Aug", y: 6 },
      { x: "Sep", y: 6 },
      { x: "Oct", y: 4 },
      { x: "Nov", y: 3 },
      { x: "Dec", y: 2 },
    ],
  },
  {
    id: "Extra Load",
    data: [
      { x: "Jan", y: 5 },
      { x: "Feb", y: 5 },
      { x: "Mar", y: 7 },
      { x: "Apr", y: 7 },
      { x: "May", y: 10 },
      { x: "Jun", y: 4 },
      { x: "Jul", y: 4 },
      { x: "Aug", y: 4 },
      { x: "Sep", y: 2 },
      { x: "Oct", y: 2 },
      { x: "Nov", y: 2 },
      { x: "Dec", y: 2 },
    ],
  },
];

function LeavesExtraLoadLineChart() {
  return (
    <div
      className="h-80 shadow-lg rounded-lg p-2"
      style={{
        backgroundColor: "#ecf3fa",
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      {/* <ResponsiveLine
        data={data}
        margin={{ top: 40, right: 30, bottom: 50, left: 70 }} // Increased left margin
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 15,
          tickRotation: 0,
          legend: "Months",
          legendOffset: 40,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
          legend: "Count",
          legendOffset: -50,
          legendPosition: "middle",
        }}
        colors={["hsl(212, 70%, 50%)", "hsl(34, 80%, 50%)"]}
        lineWidth={3}
        pointSize={0}
        curve="linear"
        enableSlices="x"
        enableGridX={false}
        enableGridY={true}
        theme={{
          fontSize: 16,
          fontFamily: "Roboto, Arial, sans-serif",
          axis: {
            domain: {
              line: {
                stroke: "#aaaaaa",
                strokeWidth: 1.5,
              },
            },
            ticks: {
              line: {
                stroke: "transparent",
              },
              text: {
                fontSize: 14,
                fill: "#444444",
                fontWeight: "500",
              },
            },
            legend: {
              text: {
                fontSize: 16,
                fill: "#222222",
                fontWeight: "bold",
              },
            },
          },
          grid: {
            line: {
              stroke: "#eaeaea",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            },
          },
        }}
        legends={[
          {
            anchor: "top-right",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: -20,
            itemsSpacing: 20,
            itemDirection: "left-to-right",
            itemWidth: 100,
            itemHeight: 20,
            itemOpacity: 1,
            symbolSize: 14,
            symbolShape: "circle",
          },
        ]}
        tooltip={({ point }) => (
          <div
            style={{
              background: "white",
              padding: "6px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
            }}
          >
            <strong>{point.serieId}</strong>
            <br />
            Month: {point.data.x}
            <br />
            Value: {point.data.y}
          </div>
        )}
      /> */}
    </div>
  );
}

export default LeavesExtraLoadLineChart;
