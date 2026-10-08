import { useState, useEffect } from "react";
import { tableApi } from "../../api/tableApi";
import { useToast } from "../../hooks/useToast";
import TableForm from "../../components/admin/TableForm";
import QRCodeDisplay from "../../components/admin/QRCodeDisplay";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/common/Button";
import Loader from "../../components/common/LoadingSpinner";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    tableApi
      .list()
      .then(({ data }) => setTables(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (payload) => {
    try {
      await tableApi.create(payload);
      toast.success("Table created");
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <Loader size="lg" className="min-h-screen" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        title={
          <>
            Tables<span className="text-primary">.</span>
          </>
        }
        actions={<Button onClick={() => setFormOpen(true)}>+ Add Table</Button>}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div key={table.id} className="card p-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mb-3">
              🪑
            </div>
            <h3 className="font-bold text-txt-primary text-lg">
              {table.table_number}
            </h3>
            <p className="text-xs text-txt-muted mt-1">
              {table.capacity} seats • {table.location || "—"}
            </p>
            <p className="text-[10px] text-txt-disabled mt-2">
              {table.order_count} orders
            </p>
            <button
              onClick={() => setSelected(table)}
              className="mt-4 w-full py-2 rounded-lg bg-bg-elevated border border-border text-xs font-semibold text-txt-primary hover:border-primary/30 transition-colors"
            >
              View QR
            </button>
          </div>
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Table ${selected.table_number}` : ""}
      >
        {selected && (
          <QRCodeDisplay
            token={selected.qr_token}
            tableNumber={selected.table_number}
          />
        )}
      </Modal>

      <TableForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
