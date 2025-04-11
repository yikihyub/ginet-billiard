import React from 'react';

interface CategoryOptionButtonProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const CategoryOptionButton = ({
  icon,
  label,
  selected,
  onClick,
}: CategoryOptionButtonProps) => {
  return (
    <button
      className={`flex items-center rounded-md px-4 py-3 text-sm ${selected ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

export default CategoryOptionButton;
