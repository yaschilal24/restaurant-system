import { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/common/Button";
import { useToast } from "../../hooks/useToast";

export default function Settings() {
  const toast = useToast();
  const [settings, setSettings] = useState({
    restaurantName: "Restaurant",
    phone: "+251 911 000 000",
    address: "123 Main Street",
    hours: "11:00 AM – 11:00 PM",
    dineIn: true,
    pickup: true,
    delivery: true,
    cash: true,
    chapa: true,
    orderAlerts: true,
    kitchenAlerts: true,
  });

  const save = () => toast.success("Settings saved");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        title={
          <>
            Settings<span className="text-primary">.</span>
          </>
        }
      />

      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">
            Restaurant
          </h3>
          <div className="space-y-4">
            {[
              { key: "restaurantName", label: "Restaurant Name" },
              { key: "phone", label: "Phone" },
              { key: "address", label: "Address" },
              { key: "hours", label: "Opening Hours" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs text-txt-secondary mb-1.5 block font-medium">
                  {f.label}
                </label>
                <input
                  type="text"
                  value={settings[f.key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [f.key]: e.target.value })
                  }
                  className="input-base"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">
            Ordering
          </h3>
          <div className="space-y-3">
            {[
              { key: "dineIn", l: "Dine-in" },
              { key: "pickup", l: "Pickup" },
              { key: "delivery", l: "Delivery" },
            ].map((f) => (
              <label
                key={f.key}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm text-txt-secondary">{f.l}</span>
                <input
                  type="checkbox"
                  checked={settings[f.key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [f.key]: e.target.checked })
                  }
                  className="accent-primary"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">
            Payments
          </h3>
          <div className="space-y-3">
            {[
              { key: "cash", l: "Cash" },
              { key: "chapa", l: "Chapa" },
            ].map((f) => (
              <label
                key={f.key}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm text-txt-secondary">{f.l}</span>
                <input
                  type="checkbox"
                  checked={settings[f.key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [f.key]: e.target.checked })
                  }
                  className="accent-primary"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-bold text-txt-primary uppercase tracking-wider mb-4">
            Notifications
          </h3>
          <div className="space-y-3">
            {[
              { key: "orderAlerts", l: "Order alerts" },
              { key: "kitchenAlerts", l: "Kitchen alerts" },
            ].map((f) => (
              <label
                key={f.key}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm text-txt-secondary">{f.l}</span>
                <input
                  type="checkbox"
                  checked={settings[f.key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [f.key]: e.target.checked })
                  }
                  className="accent-primary"
                />
              </label>
            ))}
          </div>
        </div>

        <Button onClick={save} className="w-full py-3">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
