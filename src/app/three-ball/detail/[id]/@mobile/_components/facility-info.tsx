import React from "react";

const FacilityInfo = () => {
  return (
    <div className="p-4 bg-white">
      <h2 className="text-lg font-bold mb-4">당구장 정보</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">크기</span>
          <span>30x18m</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">4구중대</span>
          <span>있음</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">3구중대</span>
          <span>있음</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">대대</span>
          <span>있음</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">국제식대대</span>
          <span>있음</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">주차</span>
          <span>무료주차</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">대여</span>
          <span>당구대 대여</span>
        </div>
      </div>
    </div>
  );
};

export default FacilityInfo;
