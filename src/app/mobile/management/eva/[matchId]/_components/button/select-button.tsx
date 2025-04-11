import React from 'react';

interface SelectButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const SelectButton = ({ label, selected, onClick }: SelectButtonProps) => {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm ${
        selected ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SelectButton;
