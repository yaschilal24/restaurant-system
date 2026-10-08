import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="flex items-center justify-between px-6 sm:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">R </div>
          <span className="font-bold text-txt-primary text-lg">Restaurant</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/menu" className="btn-primary text-sm">Go to Menu</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Now Serving
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-txt-primary leading-[1.05] tracking-tight">
              Good food.<br />
              <span className="text-primary">Good moments.</span>
            </h1>
            <p className="text-lg text-txt-secondary mt-6 max-w-lg leading-relaxed">
              Seasonal ingredients, bold flavors, and warm hospitality. Order for dine-in, pickup, or delivery.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/menu" className="btn-primary px-6 py-3">View Menu →</Link>
              <Link to="/my-orders" className="btn-secondary px-6 py-3">Track Order</Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-card overflow-hidden border border-border">
              <img
                src="https://th.bing.com/th/id/OIP.EclGhAOEtPizlbet1IhxqQHaEJ?w=313&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                alt="Signature dish"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 card-elevated p-4 backdrop-blur-lg">
              <p className="text-[10px] uppercase tracking-wider text-txt-muted">Live now</p>
              <p className="text-sm font-bold text-txt-primary mt-1">24 orders preparing</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}