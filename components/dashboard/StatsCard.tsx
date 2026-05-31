'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title:  string;
  value:  string;
  icon:   LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  color?: 'blue' | 'gold' | 'green' | 'red';
  glow?:  boolean;
}

const colorMap = {
  blue:  { icon: 'text-vault-blue-lt bg-vault-blue/15',  val: 'text-vault-text' },
  gold:  { icon: 'text-vault-gold bg-vault-gold/15',      val: 'text-vault-gold' },
  green: { icon: 'text-vault-green bg-vault-green/15',    val: 'text-vault-green' },
  red:   { icon: 'text-vault-red bg-vault-red/15',        val: 'text-vault-red' },
};

const trendIcon = {
  up:      TrendingUp,
  down:    TrendingDown,
  neutral: Minus,
};
const trendColor = {
  up:      'text-vault-green',
  down:    'text-vault-red',
  neutral: 'text-vault-muted',
};

export function StatsCard({
  title, value, icon: Icon,
  trend = 'neutral', trendLabel,
  color = 'blue', glow = false,
}: StatsCardProps) {
  const colors = colorMap[color];
  const TrendIcon = trendIcon[trend];

  return (
    <Card glow={glow} className="animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-vault-muted text-xs font-semibold uppercase tracking-wider mb-3">{title}</p>
          <p className={`text-2xl font-bold font-mono ${colors.val}`}>{value}</p>
          {trendLabel && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trendColor[trend]}`}>
              <TrendIcon className="w-3 h-3" />
              <span>{trendLabel}</span>
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
