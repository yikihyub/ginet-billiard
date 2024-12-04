import React from "react";
import { Search, User, Heart } from "lucide-react";
import Image from "next/image";

export default function QuickMenu() {
  const buttons = [
    {
      id: 1,
      text: "3구",
      icon: (
        <Image
          src="/main/icons8-snooker-64.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 2,
      text: "4구",
      icon: (
        <Image
          src="/main/icons8-billiard-70.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 3,
      text: "포켓볼",
      icon: (
        <Image
          src="/main/icons8-snooker-66.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 4,
      text: "챌린지",
      icon: (
        <Image
          src="/main/icons8-트로피-48.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 5,
      text: "팀매치",
      icon: (
        <Image
          src="/main/icons8-사람-피부-유형-7-70.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 6,
      text: "당구용어",
      icon: (
        <Image
          src="/main/icons8-이야기-책-70.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 7,
      text: "당구용품",
      icon: (
        <Image
          src="/main/icons8-billiard-53.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 8,
      text: "당구레슨",
      icon: (
        <Image
          src="/main/icons8-american-67.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-1 max-w-1024px m-auto p-4">
        {buttons.map((button) => (
          <button
            key={button.id}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-xl hover:shadow-md transition-shadow"
          >
            <span className="text-xl mb-1">{button.icon}</span>
            <span className="text-sm text-gray-700 whitespace-nowrap">
              {button.text}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
