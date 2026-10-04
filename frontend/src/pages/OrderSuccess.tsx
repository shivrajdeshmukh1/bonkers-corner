import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <CheckCircle2 size={64} className="mx-auto text-green-600" />
      <h1 className="text-3xl mt-4">Order placed!</h1>
      <p className="text-muted mt-2">Order #{id}. A confirmation email is on its way.</p>
      <div className="mt-8 flex gap-3 justify-center">
        <Link to="/orders" className="btn-primary">Track order</Link>
        <Link to="/shop" className="btn-outline">Keep shopping</Link>
      </div>
    </div>
  );
}
