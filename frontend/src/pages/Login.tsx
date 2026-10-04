import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../lib/schemas';
import { useAppDispatch } from '../store';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import toast from 'react-hot-toast';

type F = z.infer<typeof loginSchema>;
export default function Login() {
  const nav = useNavigate(); const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(loginSchema) });
  const onSubmit = async (v: F) => {
    try { await dispatch(login(v)).unwrap(); toast.success('Welcome back'); nav('/'); }
    catch (e: any) { toast.error(e.message || 'Login failed'); }
  };
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl mb-6">Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <input placeholder="Email" {...register('email')} className="input"/>
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        <input type="password" placeholder="Password" {...register('password')} className="input"/>
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        <button className="btn-primary">Sign in</button>
      </form>
      <p className="mt-4 text-sm">No account? <Link className="underline" to="/register">Register</Link></p>
    </div>
  );
}
