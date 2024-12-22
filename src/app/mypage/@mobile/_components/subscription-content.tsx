export default function SubscriptionContent() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">다양한 클래스</h2>
        <h3 className="text-xl mb-2">구독으로 만나보세요</h3>
        <p className="text-gray-600 mb-4">
          나에게 맞는 클래스를 추천받을 수 있어요.
        </p>
        <button className="w-full bg-[#ff5c00] text-white py-3 rounded-xl font-medium">
          구독 시작하기
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <MenuItem text="구독 혜택 알아보기" />
        <MenuItem text="결제 내역" />
        <MenuItem text="결제 수단" />
        <MenuItem text="구독 이용권 등록하기" />
        <MenuItem text="수강권 등록하기" />
      </div>

      <div>
        <h4 className="text-gray-500 mb-4">확인해주세요</h4>
        <ul className="text-sm text-gray-500 space-y-2">
          <li>
            • 정기 구독 상품의 결제 주기에 따라 최초 결제일 일자에 자동
            결제되며, 당일에 해당 일자가 없는 경우 말일에 결제가 이뤄집니다.
          </li>
          <li>
            • 설정하신 지역에 따라, 서비스에서 지원하는 결제 수단이 다를 수
            있습니다.
          </li>
        </ul>
      </div>
    </div>
  );
}

function MenuItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl cursor-pointer">
      <span>{text}</span>
      <span className="text-gray-300">{">"}</span>
    </div>
  );
}
