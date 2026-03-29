import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  pending: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    text: 'text-red-300',
    label: 'Pending',
  },
  confirmed: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-300',
    label: 'Confirmed',
  },
  packed: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    label: 'Packed',
  },
  shipped: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    label: 'Shipped',
  },
  delivered: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-300',
    label: 'Delivered',
  },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`${config.bg} ${config.border} border rounded-full font-medium ${config.text} ${sizeClasses[size]} inline-flex items-center gap-2`}>
      <span className={`w-2 h-2 rounded-full ${config.bg}`}></span>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
