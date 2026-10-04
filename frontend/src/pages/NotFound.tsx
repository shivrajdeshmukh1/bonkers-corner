import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto py-24 text-center">
      <h1 className="text-6xl font-display">404</h1>
      <p className="text-muted mt-2">This page went off the rack.</p>
      <Link className="btn-primary mt-6" to="/">Home</Link>
    </div>
  );
}
