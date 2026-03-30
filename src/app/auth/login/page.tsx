'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { RefreshCcw } from 'lucide-react'; 

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const LoginPage = () => {
  const router = useRouter();
  
  // State Utama
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: ''
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  const [attempts, setAttempts] = useState(3); // Sisa kesempatan 
  const [captcha, setCaptcha] = useState('');

  // Fungsi generate captcha acak 
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: ErrorObject = {};

    // Validasi Dasar 
    if (!formData.email.trim()) newErrors.email = 'Email tidak boleh kosong';
    if (!formData.password.trim()) newErrors.password = 'Password tidak boleh kosong';
    
    // Validasi Captcha 
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

    
    const userNPM = "241712884"; 
    if (formData.email !== `${userNPM}@gmail.com` || formData.password !== userNPM) {
      handleFailure();
      return;
    }

    // Login Berhasil 
    toast.success('Login Berhasil!', { theme: 'dark' });
    localStorage.setItem('isLoggedIn', 'true'); // Simpan status login untuk proteksi halaman
    router.push('/home');
  };

  const handleFailure = () => {
    const nextAttempts = Math.max(0, attempts - 1);
    setAttempts(nextAttempts);
    
    if (nextAttempts === 0) {
      toast.error('Login Gagal! Kesempatan habis.', { theme: 'dark' },); 
    } else {
      toast.error(`Login Gagal! Sisa kesempatan: ${nextAttempts}`, { theme: 'dark' }); 
    }
    generateCaptcha(); // Refresh captcha tiap gagal
  };

  const resetAttempts = () => {
    setAttempts(3);
    toast.info('Kesempatan login berhasil direset!', { theme: 'dark' }); 
  };

  return (
    <AuthFromWrapper title="Login">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">Sisa kesempatan: {attempts}</p> 
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="npm@gmail.com"
          />
          {errors.email && <p className="text-red-600 text-xs italic">{errors.email}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan password (NPM)"
          />
          {errors.password && <p className="text-red-600 text-xs italic">{errors.password}</p>}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="font-mono font-bold tracking-widest">{captcha}</span> 
            <button type="button" onClick={generateCaptcha} className="text-blue-600">
              <RefreshCcw size={16} />
            </button>
          </div>
          <input
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ketik captcha di atas"
          />
          {errors.captcha && <p className="text-red-600 text-xs italic">{errors.captcha}</p>}
        </div>

        <button
          type="submit"
          disabled={attempts === 0}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
            attempts === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Sign In
        </button> 

        <button
          type="button"
          onClick={resetAttempts}
          disabled={attempts > 0}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
            attempts > 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          Reset Kesempatan
        </button> 

        <SocialAuth />

        <p className="text-center text-sm text-gray-600 mt-4">
          Tidak punya akun? <Link href="/auth/register" className="text-blue-600 font-bold">Daftar</Link>
        </p>
      </form>
    </AuthFromWrapper>
  );
};

export default LoginPage;