import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { authAPI } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../ui/Toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authAPI.login(data.email, data.password);
      if (res.data.success) {
        setAuth(res.data.data.token, res.data.data.user);
        toast.success('Successfully signed in!');
        onSuccess();
        const role = res.data.data.user.role.toLowerCase();
        navigate(`/${role}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h3 className="text-2xl font-display text-text-primary mb-1">Welcome back</h3>
        <p className="text-sm text-text-muted">Enter your details to access your account.</p>
      </div>

      <FormInput
        label="Email Address"
        type="email"
        error={errors.email?.message}
        register={register('email')}
        autoComplete="email"
      />

      <div className="relative">
        <FormInput
          label="Password"
          type={showPwd ? 'text' : 'password'}
          error={errors.password?.message}
          register={register('password')}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPwd(!showPwd)}
          className="absolute right-4 top-4 text-text-muted hover:text-text-primary transition-colors"
        >
          {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <Button type="submit" loading={loading} className="w-full mt-2">
        Sign In
      </Button>
      
      <p className="text-center text-sm text-text-muted mt-4">
        Forgot your password? <a href="#" className="text-amber-500 hover:text-amber-400 transition-colors">Reset it</a>
      </p>
    </form>
  );
}
