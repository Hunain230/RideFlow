import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { signUpSchema, type SignUpFormValues } from '@/lib/validators';
import { useAppStore } from '@/store/useAppStore';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/Button';
import { PasswordStrength } from '@/components/shared/PasswordStrength';
import { fadeSlideUp } from '@/lib/motion';
import { signUpRequest } from '@/lib/authApi';

const countryCodes = ['+1', '+44', '+92', '+61', '+49', '+33', '+91'];
const roles: Array<{ key: 'rider' | 'driver'; label: string }> = [
  { key: 'rider', label: 'Rider' },
  { key: 'driver', label: 'Driver' },
];

export function SignUpModal() {
  const { isSignUpOpen, closeModals, openSignIn, login } = useAppStore();
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'rider' | 'driver'>('rider');
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { countryCode: '+1', role: 'rider', terms: false },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setSubmitError('');
    try {
      const { user } = await signUpRequest({
        fullName: data.fullName,
        email: data.email,
        countryCode: data.countryCode,
        phone: data.phone,
        password: data.password,
        role,
        licenseNumber: data.licenseNumber,
        cnic: data.cnic,
      });
      login(user.email, user.name, user.role);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    }
  };

  return (
    <Modal isOpen={isSignUpOpen} onClose={closeModals} maxWidth="480px">
      <motion.div key="signup" {...fadeSlideUp}>
        <h2 className="font-display text-[1.75rem] text-warm-white mb-1">Create Account</h2>
        <p className="text-sm text-warm-muted mb-8">Join thousands of happy riders</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="hidden" {...register('role')} />

          <div className="grid grid-cols-2 gap-3 mb-4">
            {roles.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setRole(item.key);
                  setValue('role', item.key, { shouldValidate: true });
                }}
                className={clsx(
                  'rounded-xl px-4 py-2 border text-sm transition-colors',
                  role === item.key
                    ? 'border-amber-600 text-amber-500 bg-amber-600/10'
                    : 'border-white/15 text-warm-muted hover:text-warm-white hover:border-white/25'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <FormInput
            label="Full Name"
            type="text"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <FormInput
            label="Email Address"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Phone with country code */}
          <div className="form-field">
            <div className="phone-group">
              <select
                className="country-select"
                {...register('countryCode')}
              >
                {countryCodes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="flex-1 relative">
                <input
                  type="tel"
                  className={`form-input-dark w-full ${errors.phone ? 'error' : ''}`}
                  placeholder=" "
                  {...register('phone')}
                />
                <label
                  className="absolute"
                  style={{
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    pointerEvents: 'none',
                  }}
                >
                  Phone Number
                </label>
              </div>
            </div>
            {errors.phone && (
              <p className="form-error-msg">{errors.phone.message}</p>
            )}
          </div>

          {/* Password + strength */}
          <div>
            <FormInput
              label="Create Password"
              type="password"
              error={errors.password?.message}
              {...register('password', {
                onChange: (e) => setPassword(e.target.value),
              })}
            />
            <PasswordStrength password={password} />
          </div>

          {role === 'driver' && (
            <>
              <FormInput
                label="License Number"
                type="text"
                error={errors.licenseNumber?.message}
                {...register('licenseNumber')}
              />
              <FormInput
                label="CNIC (12345-1234567-1)"
                type="text"
                error={errors.cnic?.message}
                {...register('cnic')}
              />
            </>
          )}

          {/* Terms */}
          <div className="flex items-start gap-3 mt-4 mb-6">
            <input
              type="checkbox"
              id="terms-check"
              className="mt-1 w-4 h-4 accent-amber-600"
              {...register('terms')}
            />
            <label htmlFor="terms-check" className="text-xs text-warm-muted leading-relaxed">
              By signing up, you agree to our{' '}
              <a href="#" className="text-amber-500 hover:text-amber-400">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-amber-500 hover:text-amber-400">Privacy Policy</a>
            </label>
          </div>
          {errors.terms && (
            <p className="form-error-msg mb-4">{errors.terms.message}</p>
          )}

          {submitError && <p className="form-error-msg mb-4">{submitError}</p>}

          <Button variant="primary" fullWidth type="submit" disabled={isSubmitting} className="mb-6">
            {isSubmitting ? 'Creating account…' : 'Sign Up'}
          </Button>
        </form>

        <div className="form-divider">or</div>

        <div className="flex flex-col gap-3 mt-2">
          {[
            { label: 'Continue with Google', icon: <Chrome size={18} /> },
            { label: 'Continue with Apple', icon: <span className="text-lg leading-none">⌘</span> },
          ].map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              className="btn btn-glass w-full flex items-center gap-3 justify-start px-5 py-3"
            >
              <span className="text-amber-400">{icon}</span>
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-warm-muted mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={openSignIn}
            className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            Sign In →
          </button>
        </p>
      </motion.div>
    </Modal>
  );
}
