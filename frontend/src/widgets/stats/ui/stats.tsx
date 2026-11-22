import { mockStats, type StatItem } from "../model/mocks";
import { StatCard } from "./stat-card";

export function Stats({ items = mockStats }: { items?: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.id} {...item} />
      ))}
    </div>
  );
}
