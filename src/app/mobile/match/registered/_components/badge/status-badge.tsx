import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  getStatusLabels,
  getStatusVariants,
} from '@/utils/(match)/match-utils';
import { StatusBadgeProps } from '../../../_types';

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = getStatusVariants();
  const labels = getStatusLabels();

  return (
    <Badge className="bg-green-700" variant={variants[status] || 'default'}>
      {labels[status as keyof typeof labels] || '알 수 없음'}
    </Badge>
  );
}
