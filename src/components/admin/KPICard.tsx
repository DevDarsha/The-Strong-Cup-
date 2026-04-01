import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  loading?: boolean;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    trend: 'text-blue-400',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    trend: 'text-green-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    trend: 'text-purple-400',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: 'text-orange-400',
    trend: 'text-orange-400',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    trend: 'text-red-400',
  },
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  loading = false,
}) => {
  const styles = colorStyles[color];

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
          {loading ? (
            <div className="h-8 bg-slate-700/50 rounded w-1/2 animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-white">{value}</p>
          )}
          {trend && !loading && (
            <div className={`mt-2 flex items-center gap-1 text-sm ${styles.trend}`}>
              <span className={trend.isPositive ? 'text-green-400' : 'text-red-400'}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-slate-500">vs last period</span>
            </div>
          )}
        </div>
        <div className={`${styles.icon} opacity-80`}>
          <Icon size={32} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
