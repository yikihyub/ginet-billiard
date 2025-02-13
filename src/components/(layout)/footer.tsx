'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/login')) {
    return null;
  }

  if (pathname.startsWith('/three-ball/reserve')) {
    return null;
  }

  if (pathname.startsWith('/signup')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 py-6 text-gray-400">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 My Website. All rights reserved.</p>
        <p className="mt-2">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>{' '}
          |{' '}
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
}
