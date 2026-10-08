export default function CategoryTabs({ categories = [], active, onChange }) {
  const tabs = [{ id: null, name: 'All' }, ...categories];
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id ?? 'all'}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
            ${active === tab.id ? 'bg-primary text-white' : 'bg-bg-elevated text-txt-secondary border border-border hover:text-txt-primary'}`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}