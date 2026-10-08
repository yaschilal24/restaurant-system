export default function RestaurantInfo() {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold text-txt-primary mb-3">About Us</h3>
      <p className="text-sm text-txt-secondary leading-relaxed">
        A modern dining experience with seasonal ingredients, bold flavors, and warm hospitality.
      </p>
      <div className="mt-4 space-y-2 text-sm">
        <p className="text-txt-muted">📍 123 Main Street</p>
        <p className="text-txt-muted">🕐 Open 11:00 AM – 11:00 PM</p>
        <p className="text-txt-muted">📞 +251 911 000 000</p>
      </div>
    </div>
  );
}