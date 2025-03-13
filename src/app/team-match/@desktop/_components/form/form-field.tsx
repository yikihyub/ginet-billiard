'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}

export const FormField = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: FormFieldProps) => (
  <div>
    <Label htmlFor={id} className="font-medium">
      {label}
      {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      className="mt-2"
    />
  </div>
);
