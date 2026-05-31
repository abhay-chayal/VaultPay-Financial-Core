'use client';
import React from 'react';

interface SkeletonProps {
  rows?: number;
  className?: string;
}

function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`
        h-4 rounded-lg bg-gradient-to-r
        from-vault-card via-vault-border to-vault-card
        bg-[length:200%_100%] animate-shimmer ${className}
      `}
    />
  );
}

export function SkeletonLoader({ rows = 3, className = '' }: SkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-vault-card border border-vault-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <SkeletonLine className="w-32" />
            <SkeletonLine className="w-20" />
          </div>
          <SkeletonLine className="w-3/4" />
          <div className="flex gap-4">
            <SkeletonLine className="w-24" />
            <SkeletonLine className="w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-vault-card border border-vault-border rounded-2xl p-6 space-y-4 ${className}`}>
      <SkeletonLine className="w-1/3 h-3" />
      <SkeletonLine className="w-1/2 h-8" />
      <SkeletonLine className="w-2/3 h-3" />
    </div>
  );
}
