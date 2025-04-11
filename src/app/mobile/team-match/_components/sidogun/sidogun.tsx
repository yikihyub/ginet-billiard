'use client';

import { useState, useEffect } from 'react';
import { SidoData } from '../../_types';

export default function LocationSelector() {
  const [data, setData] = useState<SidoData>({});
  const [selectedSido, setSelectedSido] = useState<string>('');
  const [selectedGu, setSelectedGu] = useState<string>('');
  const [selectedDong, setSelectedDong] = useState<string>('');
  const [guList, setGuList] = useState<string[]>([]);
  const [dongList, setDongList] = useState<string[]>([]);

  useEffect(() => {
    // JSON 파일 불러오기
    fetch('/legal_dong.json')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleSidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sido = e.target.value;
    setSelectedSido(sido);
    setSelectedGu('');
    setSelectedDong('');
    setGuList(Object.keys(data[sido] || {}));
    setDongList([]);
  };

  const handleGuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gu = e.target.value;
    setSelectedGu(gu);
    setSelectedDong('');
    setDongList(data[selectedSido]?.[gu]?.administrative || []);
  };

  const handleDongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDong(e.target.value);
  };

  return (
    <div className="!mt-2">
      <div className="grid grid-cols-3 gap-4">
        {/* 시/도 선택 */}
        <select
          value={selectedSido}
          onChange={handleSidoChange}
          className="w-full rounded-lg border p-2 shadow-sm"
        >
          <option value="">시/도 선택</option>
          {Object.keys(data).map((sido) => (
            <option key={sido} value={sido}>
              {sido}
            </option>
          ))}
        </select>

        {/* 구/군 선택 */}
        <select
          value={selectedGu}
          onChange={handleGuChange}
          className="w-full rounded-lg border p-2 shadow-sm"
          disabled={!selectedSido}
        >
          <option value="">구/군 선택</option>
          {guList.map((gu) => (
            <option key={gu} value={gu}>
              {gu}
            </option>
          ))}
        </select>

        {/* 동/읍/면 선택 */}
        <select
          value={selectedDong}
          onChange={handleDongChange}
          className="w-full rounded-lg border p-2 shadow-sm"
          disabled={!selectedGu}
        >
          <option value="">동/읍/면 선택</option>
          {dongList.map((dong) => (
            <option key={dong} value={dong}>
              {dong}
            </option>
          ))}
        </select>
      </div>

      {/* 선택된 값 표시 */}
      {selectedSido && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <h3 className="font-medium">선택된 주소:</h3>
          <p>
            {selectedSido} {selectedGu} {selectedDong}
          </p>
        </div>
      )}
    </div>
  );
}
