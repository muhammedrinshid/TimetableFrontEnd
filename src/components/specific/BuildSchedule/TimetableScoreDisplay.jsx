import React from "react";
import {
  CircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

const TimetableScoreDisplay = ({ scores }) => {
  const { soft, hard, score } = scores;

  const getQualityLabel = (score) => {
    if (score === 100) return "Perfect";
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Satisfactory";
    if (score >= 50) return "Fair";
    return "Needs Improvement";
  };

  const getColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const ScoreCard = ({ title, value, type }) => {
    const getIcon = () => {
      if (value === 0)
        return <CheckCircleIcon className="w-8 h-8 text-green-500" />;
      if (type === "hard")
        return <XCircleIcon className="w-8 h-8 text-red-500" />;
      return <AlertTriangleIcon className="w-8 h-8 text-yellow-500" />;
    };

    return (
      <div className="bg-white rounded-lg p-4 shadow-md flex items-center space-x-4">
        {getIcon()}
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 mb-8 border-b">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Timetable Quality Assessment
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <ScoreCard title="Mandatory Directives" value={hard} type="hard" />
        <ScoreCard title="Optional Directives" value={soft} type="soft" />
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <CircleIcon className={`w-40 h-40 ${getColor(score)}`} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getColor(score)}`}>
              {score}%
            </span>
            <span className="text-vs font-medium text-gray-600">
              {getQualityLabel(score)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableScoreDisplay;