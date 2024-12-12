interface MatchInfo {
  time: string;
  location: string;
  details: string;
  level: string;
  players: string;
  isSpecial?: boolean;
  status: "매칭임박" | "대기" | "신청가능";
}

function MatchCard({
  time,
  location,
  details,
  level,
  players,
  isSpecial,
  status,
}: MatchInfo) {
  return (
    <div className="border-b py-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg mb-1">{time}</div>
          <div className="text-lg font-medium mb-2">{location}</div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-red-500">•</span>
            <span className="text-gray-600">여자매치</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{players}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{details}</span>
            {level && (
              <>
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {level}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          className={`px-4 py-2 rounded-md ${
            status === "매칭임박"
              ? "bg-red-500 text-white"
              : status === "신청가능"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {status}
        </button>
      </div>
    </div>
  );
}

export default function MatchList() {
  const matches: MatchInfo[] = [
    {
      time: "19:00",
      location: "안양 평촌 칼라힐 풋살파크 A구장",
      details: "6vs6 · 3파전",
      level: "아마추어1 이하",
      players: "여자매치",
      status: "매칭임박",
    },
    {
      time: "19:00",
      location: "서울 도봉 루다 풋살장",
      details: "5vs5 · 3파전 · 일반",
      players: "여자매치",
      level: "",
      status: "매칭임박",
    },
    {
      time: "19:00",
      location: "서울 도봉 루다 풋살장",
      details: "5vs5 · 3파전 · 일반",
      players: "여자매치",
      level: "",
      status: "매칭임박",
    },
    {
      time: "19:00",
      location: "서울 도봉 루다 풋살장",
      details: "5vs5 · 3파전 · 일반",
      players: "여자매치",
      level: "",
      status: "매칭임박",
    },
    {
      time: "19:00",
      location: "서울 도봉 루다 풋살장",
      details: "5vs5 · 3파전 · 일반",
      players: "여자매치",
      level: "",
      status: "매칭임박",
    },
    {
      time: "19:00",
      location: "서울 도봉 루다 풋살장",
      details: "5vs5 · 3파전 · 일반",
      players: "여자매치",
      level: "",
      status: "매칭임박",
    },
  ];

  return (
    <div className="w-full mx-auto pl-4 pr-4 mt-6">
      <div className="text-xl font-bold">12월 12일 목요일</div>
      {matches.map((match, index) => (
        <MatchCard key={index} {...match} />
      ))}
    </div>
  );
}
