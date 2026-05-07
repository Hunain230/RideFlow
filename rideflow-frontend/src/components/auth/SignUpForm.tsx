import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { authAPI } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../ui/Toast';

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().optional(),
  isDriver: z.boolean(),
  licenseNumber: z.string().optional(),
  cnic: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isDriver) {
    if (!data.licenseNumber || data.licenseNumber.length < 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'License number is required for drivers', path: ['licenseNumber'] });
    }
    if (!data.cnic || data.cnic.length < 13) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Valid CNIC is required for drivers', path: ['cnic'] });
    }
  }
});

type FormData = z.infer<typeof schema>;

export function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isDriver: false }
  });

  const isDriver = watch('isDriver');
  const password = watch('password') || '';

  // Calculate password strength (0-4)
  let strength = 0;
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 1;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const role = data.isDriver ? 'Driver' : 'Rider';
      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role,
        phoneNumber: data.phoneNumber,
      };
      if (data.isDriver) {
        payload.licenseNumber = data.licenseNumber;
        payload.cnic = data.cnic;
      }
      
      const res = await authAPI.register(payload);
      if (res.data.success) {
        toast.success('Account created successfully!');
        // Auto-login
        const loginRes = await authAPI.login(data.email, data.password);
        if (loginRes.data.success) {
          setAuth(loginRes.data.data.token, loginRes.data.data.user);
          onSuccess();
          navigate(`/${role.toLowerCase()}`);
        } else {
          onSuccess(); // Registration succeeded but login failed, close modal
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <h3 className="text-2xl font-display text-text-primary mb-1">Join RideFlow</h3>
        <p className="text-sm text-text-muted">Create an account to get started.</p>
      </div>

      <div className="flex justify-center mb-2">
        <Toggle
          checked={isDriver}
          onChange={(checked) => setValue('isDriver', checked, { shouldValidate: true })}
          label="Sign up as Driver"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput label="First Name" error={errors.firstName?.message} register={register('firstName')} />
        <FormInput label="Last Name" error={errors.lastName?.message} register={register('lastName')} />
      </div>

      <FormInput label="Email Address" type="email" error={errors.email?.message} register={register('email')} />
      
      <div className="relative">
        <FormInput label="Password" type="password" error={errors.password?.message} register={register('password')} />
        <div className="flex gap-1 mt-2 px-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-1 w-full rounded-full transition-colors duration-300 ${
                strength >= level 
                  ? level <= 2 ? 'bg-amber-500' : 'bg-success' 
                  : 'bg-glass-border'
              }`}
            />
          ))}
        </div>
      </div>

      <FormInput label="Phone Number (Optional)" type="tel" error={errors.phoneNumber?.message} register={register('phoneNumber')} />

      <AnimatePresence>
        {isDriver && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col gap-4 overflow-hidden"
          >
            <FormInput label="License Number" error={errors.licenseNumber?.message} register={register('licenseNumber')} />
            <FormInput label="CNIC (Format: XXXXX-XXXXXXX-X)" error={errors.cnic?.message} register={register('cnic')} />
          </motion.div>
        )}
      </AnimatePresence>

      <Button type="submit" loading={loading} className="w-full mt-4">
        Create Account
      </Button>
    </form>
  );
}
