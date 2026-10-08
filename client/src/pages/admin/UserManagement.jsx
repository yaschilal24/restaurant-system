import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../hooks/useToast';
import UserForm from '../../components/admin/UserForm';
import DataTable from '../../components/admin/DataTable';
import Avatar from '../../components/common/Avatar';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    adminApi.listUsers()
      .then(({ data }) => setUsers(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (payload) => {
    try {
      await adminApi.createStaff(payload);
      toast.success('Staff account created');
      setFormOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const roleColors = {
    admin: 'bg-primary/15 text-primary border-primary/30',
    staff: 'bg-info/15 text-info border-info/30',
    customer: 'bg-success/15 text-success border-success/30',
  };

  const columns = [
    { key: 'name', label: 'Name', render: (u) => (
      <div className="flex items-center gap-3">
        <Avatar name={u.name} size="sm" />
        <span className="font-medium text-txt-primary">{u.name}</span>
      </div>
    )},
    { key: 'email', label: 'Email', render: (u) => <span className="text-txt-secondary">{u.email}</span> },
    { key: 'phone', label: 'Phone', render: (u) => <span className="text-txt-secondary">{u.phone || '—'}</span> },
    { key: 'role', label: 'Role', render: (u) => (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${roleColors[u.role]}`}>
        {u.role}
      </span>
    )},
    { key: 'created_at', label: 'Created', render: (u) => <span className="text-txt-muted text-xs">{formatDate(u.created_at)}</span> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Users<span className="text-primary">.</span></>}
        actions={<Button onClick={() => setFormOpen(true)}>+ Create Staff</Button>} />

      <DataTable columns={columns} rows={users} loading={loading} />

      <UserForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} />
    </div>
  );
}