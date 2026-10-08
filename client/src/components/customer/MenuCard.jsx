import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatCurrency';

export default function MenuCard({ item, featured = false }) {
  const { addItem } = useCart();
  const toast = useToast();

 const handleAdd = () => {
  if (!item.is_available) return;
  // Pass the full item so CartContext can normalize
  addItem({
    menu_item_id: item.id ?? item.menu_item_id,   // ← critical
    name: item.name,
    price: Number(item.price),
    image_url: item.image_url,
  });
  toast.success(`${item.name} added`);
};

const imgSrc = item.image_url 
  || `https://loremflickr.com/600/400/${encodeURIComponent(item.name.split(' ')[0])},food`;
  return (
    <div className={`card overflow-hidden group transition-all duration-300 hover:border-primary/20 ${featured ? 'sm:col-span-2 sm:row-span-2' : ''}`}>
      <div className={`relative overflow-hidden ${featured ? 'h-72 sm:h-80' : 'h-44'}`}>
        <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://source.unsplash.com/600x400/?restaurant,food'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {item.is_featured && <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-bold uppercase tracking-wider">Top Seller</span>}
          {item.tags?.includes('vegan') && <span className="px-2 py-0.5 rounded-full bg-success text-white text-[9px] font-bold uppercase tracking-wider">Vegan</span>}
          {item.tags?.includes('spicy') && <span className="px-2 py-0.5 rounded-full bg-warning text-black text-[9px] font-bold uppercase tracking-wider">Spicy</span>}
        </div>
      </div>
      <div className={`p-4 ${featured ? 'sm:p-6' : ''}`}>
        <h3 className={`font-bold text-txt-primary ${featured ? 'text-2xl sm:text-3xl' : 'text-base'}`}>{item.name}</h3>
        {item.description && (
          <p className={`text-txt-muted mt-1.5 line-clamp-2 leading-relaxed ${featured ? 'text-sm sm:text-base' : 'text-xs'}`}>{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className={`font-bold text-primary ${featured ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>{formatCurrency(item.price)}</span>
          <button onClick={handleAdd} disabled={!item.is_available} className="btn-primary text-xs px-4 py-2">
            {item.is_available ? '+ Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}