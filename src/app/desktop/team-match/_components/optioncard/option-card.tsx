import React from "react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface OptionCardProps {
  id: string;
  value: string;
  title: string;
  description: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const OptionCard = ({
  id,
  value,
  selectedValue,
  title,
  description,
  onValueChange,
}: OptionCardProps) => (
  <Label htmlFor={id} className="cursor-pointer">
    <Card
      className={`relative p-4 cursor-pointer transition-all ${
        selectedValue === value
          ? "border-2 border-[#171717]"
          : "border border-gray-200"
      }`}
    >
      <RadioGroupItem
        value={value}
        id={id}
        className="absolute right-4 top-4"
        onClick={() => onValueChange(value)}
      />
      <div className="mb-2 font-medium">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </Card>
  </Label>
);

export default OptionCard;
