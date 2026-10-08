import { useState, useEffect } from 'react';
import { menuApi } from '../../api/menuApi';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../hooks/useToast';
import CategoryForm from '../../components/admin/CategoryForm';
import DataTable from '../../components/admin/DataTable';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    menuApi.getCategories()
      .then(({ data }) => setCategories(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (payload) => {
    try {
      if (editing) await adminApi.updateCategory(editing.id, payload);
      else await adminApi.createCategory(payload);
      toast.success(editing ? 'Category updated' : 'Category created');
      setFormOpen(false); setEditing(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteCategory(deleting.id);
      toast.success('Category deleted');
      setDeleting(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (c) => <span className="font-medium text-txt-primary">{c.name}</span> },
    { key: 'description', label: 'Description', render: (c) => <span className="text-txt-secondary text-sm">{c.description || '—'}</span> },
    { key: 'item_count', label: 'Items', render: (c) => <span className="text-txt-primary font-semibold">{c.item_count}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right',
      render: (c) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => { setEditing(c); setFormOpen(true); }} className="text-xs text-primary hover:opacity-80">Edit</button>
          <button onClick={() => setDeleting(c)} className="text-xs text-danger hover:opacity-80">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Categories<span className="text-primary">.</span></>}
        actions={<Button onClick={() => { setEditing(null); setFormOpen(true); }}>+ Add Category</Button>} />

      <DataTable columns={columns} rows={categories} loading={loading} />

      <CategoryForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} initial={editing} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete Category" message={`Delete "${deleting?.name}"?`} confirmText="Delete" danger />
    </div>
  );
}