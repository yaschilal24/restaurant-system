import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

export default function CategoryForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({ name: '', description: '', sort_order: 0 });

  useEffect(() => {
    setForm({
      name: initial?.name || '',
      description: initial?.description || '',
      sort_order: initial?.sort_order || 0,
    });
  }, [initial, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, sort_order: Number(form.sort_order) });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Category' : 'Add Category'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{initial ? 'Save' : 'Create'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <div>
          <label className="text-xs text-txt-secondary mb-1.5 block font-medium">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-base h-20 resize-none" />
        </div>
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
      </form>
    </Modal>
  );
}