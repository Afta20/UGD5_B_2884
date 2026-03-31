'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFormWrapper from '../../../components/AuthFromWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';
import { RefreshCcw, Eye, EyeOff } from 'lucide-react';

type RegisterFormData = {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  
  const [captcha, setCaptcha] = useState('');
  const [strength, setStrength] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const passwordValue = watch('password', '');

  //  Generate Captcha
  const generateCaptcha = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  // Password Strength Logic 
  useEffect(() => {
    const calculateStrength = () => {
      const s = (passwordValue.length > 7 ? 25 : 0) +
                (/[A-Z]/.test(passwordValue) ? 25 : 0) +
                (/[0-9]/.test(passwordValue) ? 25 : 0) +
                (/[^A-Za-z0-9]/.test(passwordValue) ? 25 : 0);
      setStrength(Math.min(s, 100));
    };
    calculateStrength();
  }, [passwordValue]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok', { theme: 'dark' });
      return;
    }

    toast.success('Register Berhasil!', { theme: 'dark' });
    router.push('/auth/login');
  };

  return (
    <AuthFormWrapper title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        
        {/* Username (Min 3, Max 8) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            {...register('username', { 
              required: 'Username wajib diisi',
              minLength: { value: 3, message: 'Minimal 3 karakter' },
              maxLength: { value: 8, message: 'Maksimal 8 karakter' }
            })}
            className={`w-full px-4 py-2 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="3-8 karakter"
          />
          {errors.username && <p className="text-red-600 text-xs italic">{errors.username.message}</p>}
        </div>

        {/* Email (Pattern Validation) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email wajib diisi',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Format email tidak valid (@ dan .com/.net/.co)'
              }
            })}
            className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="contoh@mail.com"
          />
          {errors.email && <p className="text-red-600 text-xs italic">{errors.email.message}</p>}
        </div>

        {/* Nomor Telepon (Hanya Angka, Min 10) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input
            type="text"
            {...register('nomorTelp', { 
              required: 'Nomor telepon wajib diisi',
              minLength: { value: 10, message: 'Minimal 10 karakter' },
              pattern: { value: /^[0-9]*$/, message: 'Hanya boleh angka' }
            })}
            className={`w-full px-4 py-2 rounded-lg border ${errors.nomorTelp ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Minimal 10 angka"
          />
          {errors.nomorTelp && <p className="text-red-600 text-xs italic">{errors.nomorTelp.message}</p>}
        </div>

        {/* Password & Strength Indicator */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              {...register('password', { 
                required: 'Password wajib diisi',
                minLength: { value: 8, message: 'Minimal 8 karakter' }
              })}
              className={`w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Minimal 8 karakter"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-gray-500">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${strength < 50 ? 'bg-red-500' : strength < 100 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${strength}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">Strength: {strength}%</p>
          {errors.password && <p className="text-red-600 text-xs italic">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <div className="relative">
            <input
              type={showConfirmPass ? 'text' : 'password'}
              {...register('confirmPassword', { required: 'Konfirmasi password wajib diisi' })}
              className={`w-full px-4 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ulangi password"
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-2.5 text-gray-500">
              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Captcha */}
        <div className="space-y-1">
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="font-mono font-bold">{captcha}</span>
            <button type="button" onClick={generateCaptcha} className="text-blue-600"><RefreshCcw size={16} /></button>
          </div>
          <input
            {...register('captcha', {
              required: 'Captcha wajib diisi',
              validate: value => value === captcha || 'Harus sesuai dengan captcha yang ditampilkan'
            })}
            className={`w-full px-4 py-2 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-xs italic">{errors.captcha.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
          Register
        </button>

        <SocialAuth />

        <p className="text-center text-sm text-gray-600 mt-2">
          Sudah punya akun? <Link href="/auth/login" className="text-blue-600 font-bold">Login</Link>
        </p>
      </form>
    </AuthFormWrapper>
  );
};

export default RegisterPage;