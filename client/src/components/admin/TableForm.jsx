import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

export default function TableForm({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ table_number: '', capacity: 4, location: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, capacity: Number(form.capacity) });
    setForm({ table_number: '', capacity: 4, location: '' });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Table"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Table</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Table Number" value={form.table_number} onChange={(e) => setForm({ ...form, table_number: e.target.value })} required placeholder="T11" />
        <Input label="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Main Hall" />
      </form>
    </Modal>
  );
}