import { useState, useEffect } from 'react';
import { menuApi } from '../../api/menuApi';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../hooks/useToast';
import MenuForm from '../../components/admin/MenuForm';
import DataTable from '../../components/admin/DataTable';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatCurrency } from '../../utils/formatCurrency';

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([menuApi.getItems(), menuApi.getCategories()])
      .then(([i, c]) => { setItems(i.data.data); setCategories(c.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await adminApi.updateMenuItem(editing.id, payload);
        toast.success('Item updated');
      } else {
        await adminApi.createMenuItem(payload);
        toast.success('Item created');
      }
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteMenuItem(deleting.id);
      toast.success('Item deleted');
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const toggleAvail = async (item) => {
    try {
      await adminApi.toggleAvailability(item.id, !item.is_available);
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_available: !i.is_available } : i));
    } catch (err) { toast.error('Failed'); }
  };

  const filtered = filter ? items.filter((i) => i.category_id === filter) : items;

  const columns = [
    {
      key: 'name', label: 'Item',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg-elevated shrink-0">
            <img src={item.image_url || `https://source.unsplash.com/100x100/?food,${encodeURIComponent(item.name)}`}
              alt={item.name} className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://source.unsplash.com/100x100/?food'; }} />
          </div>
          <div>
            <p className="font-medium text-txt-primary">{item.name}</p>
            <p className="text-xs text-txt-muted line-clamp-1">{item.description}</p>
          </div>
        </div>
      ),
    },
    { key: 'category_name', label: 'Category', render: (i) => <span className="text-txt-secondary">{i.category_name}</span> },
    { key: 'price', label: 'Price', render: (i) => <span className="font-semibold text-txt-primary">{formatCurrency(i.price)}</span> },
    {
      key: 'is_available', label: 'Available',
      render: (i) => (
        <button onClick={() => toggleAvail(i)}
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${i.is_available ? 'text-success' : 'text-txt-muted'}`}>
          <span className={`w-2 h-2 rounded-full ${i.is_available ? 'bg-success' : 'bg-txt-muted'}`} />
          {i.is_available ? 'Available' : 'Hidden'}
        </button>
      ),
    },
    {
      key: 'actions', label: 'Actions', align: 'right',
      render: (i) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => { setEditing(i); setFormOpen(true); }} className="text-xs text-primary hover:opacity-80">Edit</button>
          <button onClick={() => setDeleting(i)} className="text-xs text-danger hover:opacity-80">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Menu Management<span className="text-primary">.</span></>}
        actions={<Button onClick={() => { setEditing(null); setFormOpen(true); }}>+ Add Item</Button>} />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <button onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${!filter ? 'bg-primary text-white' : 'bg-bg-elevated text-txt-secondary border border-border'}`}>
          All
        </button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setFilter(c.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${filter === c.id ? 'bg-primary text-white' : 'bg-bg-elevated text-txt-secondary border border-border'}`}>
            {c.name} ({c.item_count})
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={filtered} loading={loading} />

      <MenuForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} categories={categories} initial={editing} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete Item" message={`Delete "${deleting?.name}"? This cannot be undone.`} confirmText="Delete" danger />
    </div>
  );
}