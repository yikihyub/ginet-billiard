import React from "react";

const MatchData = () => {
  return (
    <div className="p-4 border-b">
      <h2 className="text-lg font-bold mb-4">매치 데이터</h2>
      <div className="grid grid-cols-6 gap-4 text-center">
        {["루키", "스타터", "비기너", "아마추어", "세미프로", "프로"].map(
          (label, index) => (
            <div key={index} className="flex flex-col">
              <div className="h-20 bg-gray-100 relative">
                <div
                  className="absolute bottom-0 w-full bg-yellow-300"
                  style={{ height: `${[20, 0, 10, 60, 10, 0][index]}%` }}
                ></div>
              </div>
              <span className="text-sm mt-1">{label}</span>
              <span className="text-sm text-gray-500">
                {[20, 0, 10, 60, 10, 0][index]}%
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MatchData;
