import React from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';

interface OptionCardProps {
  id: string;
  value: string;
  title: string;
  description: string;
  selectedValue: string;
  srcUrl: string;
  onValueChange: (value: string) => void;
  imagePosition?: 'left' | 'right'; // Control image position
}

const OptionCard = ({
  id,
  value,
  selectedValue,
  title,
  description,
  srcUrl,
  onValueChange,
  imagePosition = 'left',
}: OptionCardProps) => (
  <Label htmlFor={id} className="cursor-pointer">
    <Card
      className={`relative flex cursor-pointer items-center p-4 transition-all ${
        selectedValue === value
          ? 'border-2 border-[#171717]'
          : 'border border-gray-200'
      }`}
    >
      <RadioGroupItem
        value={value}
        id={id}
        className="absolute right-4 top-4"
        onClick={() => onValueChange(value)}
      />

      {/* For left image position */}
      {imagePosition === 'left' && (
        <>
          <div className="mr-4 flex-shrink-0">
            <Image
              width={90}
              height={90}
              src={srcUrl}
              alt={title}
              className="object-contain"
            />
          </div>
          <div className="flex-grow"></div>
          <div className="mr-6 flex flex-col">
            <div className="text-lg font-bold text-[#171717]">{title}</div>
            <div className="text-md text-gray-600">{description}</div>
          </div>
        </>
      )}

      {/* For right image position - 2 vs 2 card */}
      {imagePosition === 'right' && (
        <>
          <div className="flex flex-col">
            <div className="text-lg font-bold text-[#171717]">{title}</div>
            <div className="text-md text-gray-600">{description}</div>
          </div>
          <div className="flex-grow"></div>
          <div className="flex-shrink-0">
            <Image
              width={90}
              height={90}
              src={srcUrl}
              alt={title}
              className="ml-4 mr-4 object-contain"
            />
          </div>
        </>
      )}
    </Card>
  </Label>
);

export default OptionCard;
