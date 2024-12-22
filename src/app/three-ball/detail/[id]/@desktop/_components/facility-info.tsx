import React from "react";

const FacilityInfo = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">당구장 정보</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">당구장 크기</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">국제식 대대</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">4구 당구대</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">3구 당구대</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">포켓볼</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">화장실</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">흡연실</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">주차</span>
        </div>
      </div>
    </div>
  );
};

export default FacilityInfo;
