import CartDrawer from '../../components/customer/CartDrawer';
import PageHeader from '../../components/layout/PageHeader';

export default function Cart() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title={<>Cart<span className="text-primary">.</span></>} />
      <div className="card h-[600px]">
        <CartDrawer />
      </div>
    </div>
  );
}