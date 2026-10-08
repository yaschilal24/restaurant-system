import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';

export default function Topbar({ title }) {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-primary">
      <h1 className="text-lg font-bold text-txt-primary">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs text-txt-muted hidden sm:block">{user?.email}</span>
        <Avatar name={user?.name} size="sm" />
      </div>
    </header>
  );
}