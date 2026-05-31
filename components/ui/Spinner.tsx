'use client';
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      className={`
        ${sizeMap[size]} border-2 border-vault-border border-t-vault-blue
        rounded-full animate-spin ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}
