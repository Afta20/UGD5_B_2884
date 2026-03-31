'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { RefreshCcw, Eye, EyeOff } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  rememberMe: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const LoginPage = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<ErrorObject>({});
  const [attempts, setAttempts] = useState(3);
  const [captcha, setCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const generateCaptcha = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: ErrorObject = {};

    if (!formData.email.trim()) newErrors.email = 'Email tidak boleh kosong';
    if (!formData.password.trim()) newErrors.password = 'Password tidak boleh kosong';
    
    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== captcha) {
      newErrors.captcha = 'Captcha salah';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      handleFailure();
      return;
    }

    // Ganti '220711905' dengan NPM aslimu
    const userNPM = "220711905"; 
    if (formData.email !== `${userNPM}@gmail.com` || formData.password !== userNPM) {
      handleFailure();
      return;
    }

    toast.success('Login Berhasil!', { theme: 'dark', position: "top-right" });
    localStorage.setItem('isLoggedIn', 'true');
    router.push('/home');
  };

  const handleFailure = () => {
    const nextAttempts = Math.max(0, attempts - 1);
    setAttempts(nextAttempts);
    
    if (nextAttempts === 0) {
      toast.error('Login Gagal! Kesempatan habis.', { theme: 'dark', position: "top-right" });
    } else {
      toast.error(`Login Gagal! Sisa kesempatan: ${nextAttempts}`, { theme: 'dark', position: "top-right" });
    }
    generateCaptcha();
  };

  const resetAttempts = () => {
    setAttempts(3);
    toast.info('Kesempatan login berhasil direset!', { theme: 'dark', position: "top-right" });
  };

  return (
    <AuthFromWrapper title="Login">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="npm@gmail.com"
          />
          {errors.email && <p className="text-red-600 text-[10px] italic">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-[10px] italic">{errors.password}</p>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2 h-3 w-3 rounded border-gray-300"
            />
            Ingat Saya
          </label>
          <Link href="/auth/forgot-password" className="text-blue-600 hover:underline font-semibold">
            Forgot Password?
          </Link>
        </div>

        {/* Captcha */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg border border-dashed border-gray-300">
            <span className="font-mono font-bold tracking-widest text-lg text-gray-700 italic select-none">
              {captcha}
            </span>
            <button type="button" onClick={generateCaptcha} className="text-blue-500 hover:rotate-180 transition-transform">
              <RefreshCcw size={16} />
            </button>
          </div>
          <input
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-[10px] italic">{errors.captcha}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={attempts === 0}
          className={`w-full font-bold py-2.5 px-4 rounded-lg shadow-md transition-all ${
            attempts === 0 ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Sign In
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={resetAttempts}
          disabled={attempts > 0}
          className={`w-full font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all ${
            attempts > 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="text-center text-sm text-gray-600 mt-4">
          Tidak punya akun? <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">Daftar</Link>
        </p>
      </form>
    </AuthFromWrapper>
  );
};

export default LoginPage;