import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const MeterGaugeChart = ({
  value1,
  value2,
  label1,
  label2,
  color1 = "#3b82f6",
  color2 = "#ef4444",
  size = "medium",
  centerText,
  centerIcon,
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return { svgSize: 120, strokeWidth: 12, fontSize: "0.8rem" };
      case "medium":
        return { svgSize: 200, strokeWidth: 20, fontSize: "1rem" };
      case "large":
        return { svgSize: 280, strokeWidth: 28, fontSize: "1.2rem" };
      default:
        return { svgSize: 200, strokeWidth: 20, fontSize: "1rem" };
    }
  };

  const { svgSize, strokeWidth, fontSize } = getSize();
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const radius = svgSize / 2 - strokeWidth / 2;

  const total = value1 + value2;
  const percentage1 = (value1 / total) * 100;
  const percentage2 = (value2 / total) * 100;

  const arcLength = Math.PI * radius;
  const gap = 0.1 * arcLength;
  const availableLength = arcLength - gap;

  const length1 = (percentage1 / 100) * availableLength;
  const length2 = (percentage2 / 100) * availableLength;

  return (
    <Box sx={{ position: "relative", width: svgSize, height: svgSize }}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        <path
          d={`M ${strokeWidth / 2} ${centerY} A ${radius} ${radius} 0 0 1 ${
            svgSize - strokeWidth / 2
          } ${centerY}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={`M ${strokeWidth / 2} ${centerY} A ${radius} ${radius} 0 0 1 ${
            svgSize - strokeWidth / 2
          } ${centerY}`}
          fill="none"
          stroke={color1}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${length1} ${arcLength}`}
        />
        <path
          d={`M ${strokeWidth / 2} ${centerY} A ${radius} ${radius} 0 0 1 ${
            svgSize - strokeWidth / 2
          } ${centerY}`}
          fill="none"
          stroke={color2}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${length2} ${arcLength}`}
          strokeDashoffset={-length1 - gap / 2}
        />
      </svg>

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {centerIcon}
        <Typography variant="h6" sx={{ mt: 1, fontSize }}>
          {centerText}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="body2"
            sx={{ color: color1, fontWeight: "bold", fontSize }}
          >
            {label1}: {value1}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography
            variant="body2"
            sx={{ color: color2, fontWeight: "bold", fontSize }}
          >
            {label2}: {value2}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MeterGaugeChart;
