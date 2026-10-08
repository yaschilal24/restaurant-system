import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/common/Avatar';
import PageHeader from '../../components/layout/PageHeader';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Profile<span className="text-primary">.</span></>} />

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} size="lg" />
          <div>
            <h2 className="text-xl font-bold text-txt-primary">{user?.name}</h2>
            <p className="text-sm text-txt-muted capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 pt-6 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-txt-muted">Email</span><span className="text-txt-primary">{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="flex justify-between text-sm">
              <span className="text-txt-muted">Phone</span><span className="text-txt-primary">{user?.phone}</span>
            </div>
          )}
        </div>
      </div>

      <button onClick={handleLogout} className="w-full py-3 rounded-xl text-sm font-semibold text-danger border border-danger/30 hover:bg-danger/10 transition-colors">
        Logout
      </button>
    </div>
  );
}