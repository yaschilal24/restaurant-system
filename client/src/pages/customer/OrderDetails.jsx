import { useParams } from 'react-router-dom';
import LiveOrderTracker from '../../components/customer/LiveOrderTracker';
import PageHeader from '../../components/layout/PageHeader';

export default function OrderDetails() {
  const { id } = useParams();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Order Details<span className="text-primary">.</span></>} />
      <LiveOrderTracker orderId={id} />
    </div>
  );
}