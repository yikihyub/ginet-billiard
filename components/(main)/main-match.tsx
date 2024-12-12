import React from "react";
import DateSelector from "../date-selector";

export default function MainMatch() {
  return (
    <div className="space-y-4 p-4 max-w-1024px m-auto p-4">
      {/* 필터 버튼 */}
      <DateSelector />

      {/* 필터 옵션 */}
      <div className="flex gap-3 text-sm">
        <button className="flex items-center gap-1">
          내 지역 <span>▼</span>
        </button>
        <button className="flex items-center gap-1 text-orange-500">
          🔥 해택
        </button>
        <button>마감 가리기</button>
        <button className="flex items-center gap-1">
          성별 <span>▼</span>
        </button>
        <button className="flex items-center gap-1">
          다마 <span>▼</span>
        </button>
      </div>

      <p>3구</p>
      {/* 매치 리스트 */}
      <div className="mt-0">
        {[
          {
            time: "23:00",
            title: "서울 tj빛나는 당구장",
            type: "남녀모두",
            level: "1vs1",
            status: "마감",
          },
          {
            time: "23:40",
            title: "서울 두꺼비 당구장",
            type: "남자",
            level: "1vs1",
            status: "마감",
          },
        ].map((match, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium mb-1">{match.time}</h3>
                <p className="text-gray-600">{match.title}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                {match.status}
              </span>
            </div>
            <div className="flex gap-2 text-sm text-gray-500">
              <span>• {match.type}</span>
              <span>• {match.level}</span>
            </div>
          </div>
        ))}
      </div>

      <p>4구</p>
      {/* 매치 리스트 */}
      <div className="mt-0">
        {[
          {
            time: "17:00",
            title: "당진 에이스 당구장",
            type: "남녀모두",
            level: "2vs2",
            status: "마감",
          },
          {
            time: "18:00",
            title: "당진 노블레스 당구장",
            type: "남자",
            level: "2vs2",
            status: "마감",
          },
        ].map((match, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium mb-1">{match.time}</h3>
                <p className="text-gray-600">{match.title}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                {match.status}
              </span>
            </div>
            <div className="flex gap-2 text-sm text-gray-500">
              <span>• {match.type}</span>
              <span>• {match.level}</span>
            </div>
          </div>
        ))}
      </div>

      <p>포켓볼</p>
      {/* 매치 리스트 */}
      <div className="mt-0">
        {[
          {
            time: "17:00",
            title: "당진 에이스 당구장",
            type: "남녀모두",
            level: "2vs2",
            status: "마감",
          },
          {
            time: "18:00",
            title: "당진 노블레스 당구장",
            type: "남자",
            level: "2vs2",
            status: "마감",
          },
        ].map((match, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium mb-1">{match.time}</h3>
                <p className="text-gray-600">{match.title}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                {match.status}
              </span>
            </div>
            <div className="flex gap-2 text-sm text-gray-500">
              <span>• {match.type}</span>
              <span>• {match.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
