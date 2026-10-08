export default function RestaurantInfo() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-txt-primary mb-6">About Us</h1>
        <div className="card p-6 space-y-3">
          <p className="text-sm text-txt-secondary leading-relaxed">
            A modern dining experience with seasonal ingredients, bold flavors, and warm hospitality.
          </p>
          <div className="pt-4 space-y-2 text-sm">
            <p className="text-txt-muted">📍 123 Main Street</p>
            <p className="text-txt-muted">🕐 Open 11:00 AM – 11:00 PM</p>
            <p className="text-txt-muted">📞 +251 911 000 000</p>
          </div>
        </div>
      </div>
    </div>
  );
}