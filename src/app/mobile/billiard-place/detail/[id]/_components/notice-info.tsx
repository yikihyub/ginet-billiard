import React from 'react';

export default function NoticeInfoPage() {
  return (
    <div className="mb-20 bg-white p-4">
      {/* 타이틀 */}
      <h2 className="mb-4 text-lg font-bold">
        📌 당구장 예약 및 취소 규정 안내
      </h2>

      {/* 주의사항 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5 text-gray-700">
        당구장 예약 플랫폼을 이용해 주셔서 감사합니다. 원활한 예약 및 이용을
        위해 아래 규정을 반드시 숙지해 주세요.
      </div>

      {/* 예약 규정 */}
      <div className="mb-6 rounded-lg border p-5">
        <h3 className="text-md mb-4 font-medium text-gray-800">1. 예약 규정</h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              예약 가능 시간: 당구장은 운영시간 내에서 예약이 가능합니다. (예:
              오전 10시 ~ 오후 11시)
            </span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>최소 예약 시간: 1시간 단위로 예약이 가능합니다.</span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              최대 예약 가능 시간: 한 번에 최대 4시간까지 예약할 수 있습니다.
              (연장 시 별도 문의)
            </span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              중복 예약 제한: 동일한 시간대에 1개의 테이블만 예약 가능합니다.
            </span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>예약 변경: 이용 예정 시간 최소 2시간 전까지 가능합니다.</span>
          </p>
        </div>
      </div>

      {/* 취소 및 노쇼 규정 */}
      <div className="mb-6 rounded-lg border p-5">
        <h3 className="text-md mb-4 font-medium text-gray-800">
          2. 취소 및 노쇼(No-Show) 규정
        </h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              취소 가능 시간: 이용 예정 시간 최소 2시간 전까지 취소 가능
            </span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>취소 방법: 예약 내역에서 직접 취소 가능</span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              취소 제한: 당일 예약 취소 횟수가 3회 이상 누적될 경우, 일정 기간
              예약이 제한될 수 있습니다.
            </span>
          </p>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
            <p className="mb-2 text-sm font-medium">노쇼(No-Show) 주의:</p>
            <ul className="space-y-1 pl-5">
              <li className="flex items-start text-sm">
                <span className="mr-2 text-gray-500">•</span>
                <span>예약 후 미방문 시(노쇼) 1회 경고가 부여됩니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-sm text-gray-500">•</span>
                <span>노쇼 3회 누적 시 30일간 예약 불가</span>
              </li>
              <li className="flex items-start text-sm">
                <span className="mr-2 text-gray-500">•</span>
                <span>
                  타인의 예약을 방해하기 위해 의도적으로 노쇼를 반복할 경우,
                  계정이 정지될 수 있습니다.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 이용 규칙 */}
      <div className="mb-6 rounded-lg border p-5">
        <h3 className="text-md mb-4 font-medium text-gray-800">
          3. 이용 규칙 및 주의 사항
        </h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              입장 시간 준수: 예약 시간 10분 전까지 도착하여 입장해 주세요.
            </span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              정해진 시간 초과 금지: 예약된 시간이 종료되면 즉시 퇴장해야
              합니다. (연장 시 직원 문의)
            </span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              시설 이용 매너 준수: 과도한 소음, 기물 파손, 음주 후 입장 등의
              행위는 삼가 주세요.
            </span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              개인 물품 분실 주의: 개인 소지품 분실 시 당구장 측에서는 책임지지
              않습니다.
            </span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              다른 이용자 배려: 대기자가 있을 경우 정해진 시간 내 퇴장해 주세요.
            </span>
          </p>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
            <p className="mb-2 text-sm font-medium">규칙 위반 시 조치:</p>
            <ul className="space-y-1 pl-5">
              <li className="flex items-start text-sm">
                <span className="mr-2 text-gray-500">•</span>
                <span>1회 위반 시 주의 경고</span>
              </li>
              <li className="flex items-start text-sm">
                <span className="mr-2 text-gray-500">•</span>
                <span>2회 이상 반복 시 서비스 이용 제한</span>
              </li>
              <li className="flex items-start text-sm">
                <span className="mr-2 text-gray-500">•</span>
                <span>악의적인 방해 행위 적발 시 영구 정지 조치</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 고객센터 */}
      <div className="mb-6 rounded-lg border p-5">
        <h3 className="text-md mb-4 font-medium text-gray-800">
          📌 4. 고객센터 및 문의
        </h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>운영시간: 오전 10시 ~ 오후 11시</span>
          </p>
          <p className="flex items-start text-sm">
            <span className="mr-2 text-green-600">✓</span>
            <span>
              문의 방법: 플랫폼 내 문의하기 또는 카카오톡 채널(@당구장예약)
            </span>
          </p>
        </div>
      </div>

      {/* 마무리 메시지 */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-center text-gray-700">
        ⚠️ 여러분의 원활한 이용을 위해 꼭 지켜주세요! ⚠️
        <br />
        <span className="text-blue-600">
          🚀 좋은 매너로 당구장을 함께 즐겨요! 😊
        </span>
      </div>
    </div>
  );
}
