import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { AlertCircle, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { auth, googleAuthProvider } from '../../lib/firebase';
import { AdminUser } from '../../types/cms';
import { BrandLogo } from '../common/BrandLogo';

interface AdminAuthGateProps {
  loading: boolean;
  firebaseEmail: string | null;
  adminUser: AdminUser | null;
  authError: string;
}

export function AdminAuthGate({
  loading,
  firebaseEmail,
  adminUser,
  authError,
}: AdminAuthGateProps) {
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoginError('');
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      if (msg.includes('auth/unauthorized-domain')) {
        setLoginError(
          'Domain ini belum terdaftar pada Authorized Domains di Firebase Authentication. Tambahkan domain Vercel/kustom Anda di Firebase Console -> Authentication -> Settings -> Authorized domains.'
        );
      } else {
        setLoginError(msg || 'Proses autentikasi dibatalkan atau gagal.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#0756B8] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">Memverifikasi sesi administrator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full space-y-6">
        <div className="flex items-center justify-between">
          <BrandLogo brandName="AI Diagno CMS" />
          <Lock className="w-5 h-5 text-[#0756B8]" strokeWidth={1.75} />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#0F2747]">Akses Panel Administrator</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Halaman pengelolaan konten, harga, media, dan prospek konsultasi dilindungi dengan autentikasi berbasis peran (RBAC).
          </p>
        </div>

        {(loginError || authError) && (
          <div
            role="alert"
            className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{loginError || authError}</span>
          </div>
        )}

        {firebaseEmail && !adminUser ? (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-3">
            <div className="text-xs font-semibold text-amber-900">
              Akun ({firebaseEmail}) tidak memiliki izin administrator.
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Hubungi SUPER_ADMIN untuk mendaftarkan UID akun Anda pada daftar peran administrator, atau keluar untuk masuk dengan akun yang berwenang.
            </p>
            <button
              type="button"
              onClick={() => void signOut(auth)}
              className="px-3.5 py-2 text-xs font-semibold text-amber-950 bg-white border border-amber-300 rounded-lg hover:bg-amber-100"
            >
              Keluar dari Akun Ini
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] disabled:opacity-60 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
            <span>{signingIn ? 'Memproses Masuk...' : 'Masuk dengan Akun Google Terotorisasi'}</span>
          </button>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#0756B8]">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Situs Publik</span>
          </Link>
          <span>Role Awal: SUPER_ADMIN</span>
        </div>
      </div>
    </div>
  );
}
