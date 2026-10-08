import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import MobileSidebar from '../components/layout/MobileSidebar';

export default function CustomerLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
        <MobileSidebar />
      </div>
    </div>
  );
}