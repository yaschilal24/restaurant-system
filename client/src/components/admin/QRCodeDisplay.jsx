import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ token, tableNumber }) {
  const url = `${window.location.origin}/t/${token}`;
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-2xl mb-4">
        <QRCodeSVG value={url} size={200} level="H" />
      </div>
      <p className="text-xs text-txt-muted text-center break-all mb-4 max-w-full">{url}</p>
      <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-5">
        Table {tableNumber} • Dine In
      </p>
      <button onClick={() => window.print()} className="btn-primary w-full">🖨️ Print QR</button>
    </div>
  );
}