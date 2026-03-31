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

  const npmEmailPattern = /^241712884@gmail\.com$/;

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

    // Validasi dasar: email dan password harus benar.
    const emailValue = formData.email.trim();
    const passwordValue = formData.password.trim();
    const emailValid = emailValue && npmEmailPattern.test(emailValue);
    const passwordValid = passwordValue && formData.password === '241712884';

    let emailError: string | undefined;
    let passwordError: string | undefined;

    if (!emailValue) {
      emailError = 'Email tidak boleh kosong';
    } else if (!emailValid) {
      emailError = 'Email harus sesuai dengan format npm kalian (cth. 1905@gmail.com)';
    }

    if (!passwordValue) {
      passwordError = 'Password tidak boleh kosong';
    } else if (!passwordValid) {
      passwordError = 'Password harus sesuai dengan format npm kalian (cth. 241712884)';
    }

    if (emailValue && passwordValue && (!emailValid || !passwordValid)) {
      if (!emailError) {
        emailError = 'Email harus sesuai dengan format npm kalian (cth. 1905@gmail.com)';
      }
      if (!passwordError) {
        passwordError = 'Password harus sesuai dengan format npm kalian (cth. 241712884)';
      }
    }

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
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

    // Login Berhasil
    toast.success('Login Berhasil!', { theme: 'dark', position: "top-right" });
    localStorage.setItem('isLoggedIn', 'true');
    router.push('/home');
  };

  const handleFailure = () => {
    const nextAttempts = Math.max(0, attempts - 1);
    setAttempts(nextAttempts);
    
    // Notifikasi Toast di kanan atas 
    if (nextAttempts === 0) {
      toast.error('Login Gagal! Kesempatan login habis.', { theme: 'dark', position: "top-right" });
    } else {
      toast.error(`Login Gagal! Sisa Kesempatan: ${nextAttempts}`, { theme: 'dark', position: "top-right" });
    }
    generateCaptcha();
  };

  const resetAttempts = () => {
    setAttempts(3);
    toast.success('Kesempatan login berhasil direset!', { theme: 'dark', position: "top-right" });
  };

  return (
    <AuthFromWrapper title="Login">
      {/* Label Sisa Kesempatan sesuai gambar  */}
      <div className="text-center mb-6">
        <p className="text-sm font-bold text-gray-700">Sisa Kesempatan: {attempts}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 w-full px-2">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
            placeholder="Masukkan email"
          />
          {errors.email && <p className="text-red-500 text-[11px] italic leading-tight">{errors.email}</p>}
        </div>

        {/* Password Field dengan Icon Mata  */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border transition-all ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-[11px] italic leading-tight">{errors.password}</p>}
        </div>

        {/* Remember Me & Forgot Password sesuai gambar */}
        <div className="flex items-center justify-between text-[13px]">
          <label className="flex items-center text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Ingat Saya
          </label>
          <Link href="/auth/forgot-password" className="text-blue-600 hover:underline font-bold">
            Forgot Password?
          </Link>
        </div>

        {/* Captcha Field  */}
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <div className="flex items-center bg-gray-50 border border-gray-200 px-3 py-1 rounded shadow-sm">
                <span className="font-mono font-bold tracking-widest text-gray-800 select-none">
                {captcha}
                </span>
                <button type="button" onClick={generateCaptcha} className="ml-3 text-blue-500 hover:text-blue-700 transition-transform hover:rotate-180">
                <RefreshCcw size={16} />
                </button>
            </div>
          </div>
          <input
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border transition-all ${errors.captcha ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
            placeholder="Masukkan captcha"
          />
          {errors.captcha && <p className="text-red-500 text-[11px] italic leading-tight">{errors.captcha}</p>}
        </div>

        {/* Sign In Button  */}
        <button
          type="submit"
          disabled={attempts === 0}
          className={`w-full font-bold py-2.5 px-4 rounded-lg shadow transition-all ${
            attempts === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
          }`}
        >
          Sign In
        </button>

        {/* Reset Kesempatan Button  */}
        <button
          type="button"
          onClick={resetAttempts}
          disabled={attempts > 0}
          className={`w-full font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all ${
            attempts > 0 ? 'bg-gray-400 text-white opacity-60 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white active:scale-[0.98]'
          }`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="text-center text-sm text-gray-600 mt-6">
          Tidak punya akun? <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">Daftar</Link>
        </p>
      </form>
    </AuthFromWrapper>
  );
};

export default LoginPage;