import React from "react";

const BasicInfo = () => {
  return (
    <div className="p-4 border-b bg-white mb-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-xl font-bold mb-2">두꺼비 당구장</h1>
          <p className="text-gray-600">충남 당진시 북문로1길 41-17 3층</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">1,800원</div>
          <div className="text-sm text-gray-500">/10분</div>
        </div>
      </div>
      <div className="flex space-x-2">
        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
          4구 중대
        </span>
        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
          3구 중대
        </span>
        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
          포켓볼
        </span>
      </div>
    </div>
  );
};

export default BasicInfo;
