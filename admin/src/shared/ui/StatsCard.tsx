interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function StatsCard({ title, value, icon, color = '#5B5CF9' }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
          style={{ backgroundColor: `${color}14` }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        </div>
      </div>
    </div>
  );
}
