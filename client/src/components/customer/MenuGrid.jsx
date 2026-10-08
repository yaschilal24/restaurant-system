import MenuCard from './MenuCard';
import { SkeletonGrid } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

export default function MenuGrid({ items, loading, featuredId }) {
  if (loading) return <SkeletonGrid count={6} />;
  if (!items || items.length === 0) {
    return <EmptyState icon="🍽️" title="No items found" description="Try a different category or search term." />;
  }

  const featured = items.find((i) => i.id === featuredId) || items.find((i) => i.is_featured);
  const rest = items.filter((i) => i.id !== featured?.id);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {featured && <MenuCard item={featured} featured />}
      {rest.map((item) => <MenuCard key={item.id} item={item} />)}
    </div>
  );
}