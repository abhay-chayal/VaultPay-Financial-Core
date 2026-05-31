'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export function Card({ children, className = '', glow = false, hover = false }: CardProps) {
  return (
    <div
      className={`
        relative bg-vault-card border border-vault-border rounded-2xl p-6
        shadow-card backdrop-blur-sm overflow-hidden
        ${glow ? 'shadow-glow' : ''}
        ${hover ? 'hover:border-vault-blue/50 hover:shadow-glow transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Subtle shine overlay */}
      <div className="absolute inset-0 bg-card-shine pointer-events-none rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
