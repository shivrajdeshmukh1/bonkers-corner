import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../store';
import { login } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
export default function AdminLogin() {
  const { register, handleSubmit } = useForm<{email:string;password:string}>();
  const dispatch = useAppDispatch(); const nav = useNavigate();
  const onSubmit = async (v: any) => {
    try {
      const res = await dispatch(login(v)).unwrap();
      if (res.user.role !== 'admin') { toast.error('Not an admin account'); return; }
      nav('/admin');
    } catch (e: any) { toast.error(e.message || 'Login failed'); }
  };
  return (
    <div className="min-h-screen grid place-items-center bg-ink text-bone">
      <form onSubmit={handleSubmit(onSubmit)} className="w-80 space-y-3">
        <h1 className="font-display text-3xl mb-4">Admin</h1>
        <input placeholder="Email" {...register('email')} className="w-full px-3 py-2 rounded bg-bone/10 border border-bone/20"/>
        <input type="password" placeholder="Password" {...register('password')} className="w-full px-3 py-2 rounded bg-bone/10 border border-bone/20"/>
        <button className="btn-accent w-full">Sign in</button>
      </form>
    </div>
  );
}
