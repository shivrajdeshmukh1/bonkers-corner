import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../lib/schemas';
import { useAppDispatch } from '../store';
import { register as registerThunk } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import toast from 'react-hot-toast';
type F = z.infer<typeof registerSchema>;
export default function Register() {
  const nav = useNavigate(); const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(registerSchema) });
  const onSubmit = async (v: F) => {
    try { await dispatch(registerThunk(v)).unwrap(); toast.success('Account created'); nav('/'); }
    catch (e: any) { toast.error(e.message || 'Failed'); }
  };
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl mb-6">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        {(['name','email','password'] as const).map(f => (
          <div key={f}>
            <input type={f==='password'?'password':'text'} placeholder={f} {...register(f)} className="input"/>
            {errors[f] && <p className="text-xs text-red-500">{errors[f]?.message}</p>}
          </div>
        ))}
        <button className="btn-primary">Create account</button>
      </form>
    </div>
  );
}
