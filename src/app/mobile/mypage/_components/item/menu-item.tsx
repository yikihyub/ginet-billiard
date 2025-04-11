import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function MenuItem({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="flex items-center justify-between py-3">
      <div className="flex items-center">
        <span>{label}</span>
      </div>
      <span className="text-gray-400">
        <ChevronRight className="h-5 w-5" />
      </span>
    </Link>
  );
}
