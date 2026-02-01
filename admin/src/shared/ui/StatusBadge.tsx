interface StatusBadgeProps {
  status: string;
  label: string;
}

const STATUS_COLORS: Record<string, string> = {
  // Participation status
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  abandoned: 'bg-gray-100 text-gray-500',
  force_ended: 'bg-red-100 text-red-600',
  // Campaign status
  draft: 'bg-gray-100 text-gray-500',
  published: 'bg-purple-100 text-purple-700',
  ended: 'bg-gray-100 text-gray-500',
  // Reward status
  LOCK: 'bg-gray-100 text-gray-500',
  PROGRESS: 'bg-yellow-100 text-yellow-700',
  UNLOCK: 'bg-purple-100 text-purple-700',
  APPLY: 'bg-orange-100 text-orange-700',
  SHIPPING: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
