import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

export default function MenuForm({ open, onClose, onSubmit, categories = [], initial }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '', category_id: '', is_available: true, is_featured: false, tags: '', image_url: '',
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        description: initial.description || '',
        price: initial.price || '',
        category_id: initial.category_id || '',
        is_available: initial.is_available ?? true,
        is_featured: initial.is_featured ?? false,
        tags: initial.tags?.join(', ') || '',
        image_url: initial.image_url || '',
      });
    } else {
      setForm({ name: '', description: '', price: '', category_id: categories[0]?.id || '', is_available: true, is_featured: false, tags: '', image_url: '' });
    }
  }, [initial, categories, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      category_id: Number(form.category_id),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Menu Item' : 'Add Menu Item'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{initial ? 'Save Changes' : 'Create Item'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <div>
          <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-base h-20 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <Select
            label="Category"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
        </div>
        <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
        <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="vegan, spicy" />
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="accent-primary" />
            <span className="text-txt-secondary">Available</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-primary" />
            <span className="text-txt-secondary">Featured</span>
          </label>
        </div>
      </form>
    </Modal>
  );
}