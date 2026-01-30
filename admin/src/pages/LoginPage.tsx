import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyPassword, setAuthenticated } from '../shared/lib/auth';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPassword(password)) {
      setAuthenticated();
      navigate('/');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <span className="text-4xl">⚙️</span>
          <h1 className="mt-2 text-xl font-bold text-gray-900">Routiny Admin</h1>
          <p className="mt-1 text-sm text-gray-500">관리자 비밀번호를 입력하세요</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          placeholder="비밀번호"
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#5B5CF9] focus:ring-2 focus:ring-[#5B5CF9]/20"
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-[#5B5CF9] py-3 text-sm font-semibold text-white hover:bg-[#4A4BE8] transition-colors"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
