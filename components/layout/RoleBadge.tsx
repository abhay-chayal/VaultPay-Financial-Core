'use client';
import React from 'react';
import { Role } from '@/types';
import { ShieldCheck, User } from 'lucide-react';

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const isAdmin = role === 'admin';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-bold tracking-widest uppercase rounded-full border
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}
        ${
          isAdmin
            ? 'bg-vault-gold/10 text-vault-gold border-vault-gold/40 shadow-glow-gold'
            : 'bg-vault-blue/10 text-vault-blue-lt border-vault-blue/40 shadow-glow'
        }
      `}
    >
      {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
      {role}
    </span>
  );
}
