import React, { useState } from "react";
import { Box, Paper, Tooltip, Typography } from "@mui/material";

const PieChartStatsDisplayer = ({
  data,
  size = "medium",

}) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const getSize = () => {
    switch (size) {
      case "small":
        return { svgSize: 80, strokeWidth: 12 };
      case "medium":
        return { svgSize: 120, strokeWidth: 18 };
      case "large":
        return { svgSize: 160, strokeWidth: 24 };
      default:
        return { svgSize: 120, strokeWidth: 18 };
    }
  };

  const { svgSize, strokeWidth } = getSize();
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const radius = svgSize / 2 - strokeWidth / 2;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = -90; // Start from the top
  const gapAngle = 4; // Small gap between sections

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Box height={svgSize} width={svgSize} sx={{ position: "relative" }}>

        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {data.map((item, index) => {
            const percentage = item.value / total;
            const angleSize = (360 - data.length * gapAngle) * percentage;
            const endAngle = startAngle + angleSize;

            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const largeArcFlag = angleSize > 180 ? 1 : 0;

            const pathData = [
              `M ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            ].join(" ");

            startAngle = endAngle + gapAngle;

            return (
              <Tooltip
                key={index}
                title={`${item.name}: ${item.value} (${(
                  (item.value / total) *
                  100
                ).toFixed(1)}%)`}
                arrow
              >
                <path
                  d={pathData}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s",
                    transform:
                      hoveredSegment === index ? `scale(0.95)` : "scale(1)",
                    transformOrigin: "center",
                  }}
                />
              </Tooltip>
            );
          })}
        </svg>
      </Box>

     
    </Paper>
  );
};

export default PieChartStatsDisplayer;