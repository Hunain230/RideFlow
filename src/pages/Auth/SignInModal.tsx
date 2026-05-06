import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';
import { useState } from 'react';
import { signInSchema, type SignInFormValues } from '@/lib/validators';
import { useAppStore } from '@/store/useAppStore';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/Button';
import { fadeSlideUp } from '@/lib/motion';
import { loginRequest } from '@/lib/authApi';

export function SignInModal() {
  const { isSignInOpen, closeModals, openSignUp, login } = useAppStore();
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    setSubmitError('');
    try {
      const { user } = await loginRequest(data.emailOrPhone, data.password);
      login(user.email, user.name, user.role);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <Modal isOpen={isSignInOpen} onClose={closeModals}>
      <motion.div key="signin" {...fadeSlideUp}>
        <h2 className="font-display text-[1.75rem] text-warm-white mb-1">Welcome Back</h2>
        <p className="text-sm text-warm-muted mb-8">Sign in to continue your journey</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Email or Phone Number"
            type="email"
            error={errors.emailOrPhone?.message}
            {...register('emailOrPhone')}
          />
          <FormInput
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Forgot password */}
          <div className="flex justify-end mb-6 -mt-2">
            <a href="#" className="text-sm text-amber-600 hover:text-amber-400 transition-colors">
              Forgot your password?
            </a>
          </div>

          <Button
            variant="primary"
            fullWidth
            type="submit"
            disabled={isSubmitting}
            className="mb-6"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>

          {submitError && <p className="form-error-msg mb-4">{submitError}</p>}
        </form>

        {/* Divider */}
        <div className="form-divider">or</div>

        {/* Social */}
        <div className="flex flex-col gap-3 mt-2">
          {[
            { label: 'Continue with Google', icon: <Chrome size={18} /> },
            { label: 'Continue with Apple', icon: <span className="text-lg leading-none">⌘</span> },
          ].map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              className="btn btn-glass w-full flex items-center gap-3 justify-start px-5 py-3"
              onClick={closeModals}
            >
              <span className="text-amber-400">{icon}</span>
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>

        {/* Switch */}
        <p className="text-center text-sm text-warm-muted mt-6">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={openSignUp}
            className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            Sign Up →
          </button>
        </p>

      </motion.div>
    </Modal>
  );
}
